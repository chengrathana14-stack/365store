import { createHash, randomBytes } from "node:crypto";

const formatTag = (id: string, value: string): string => {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
};

const crc16 = (data: string): string => {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
};

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const amountFloat = Number(body?.amount || 0);
    const currency = String(body?.currency || "USD").toUpperCase();
    const description = body?.description || "Order Payment";

    // Format amount without trailing zeros if integer, otherwise 2 decimals (e.g. "10" or "10.50" -> "10.5")
    const amountStr = amountFloat.toFixed(2).replace(/\.?0+$/, "");

    // Bill Number
    const billNumber = randomBytes(6).toString("hex").toUpperCase();

    // 1. Payload Format Indicator: 01
    const tag00 = formatTag("00", "01");

    // 2. Point of Initiation Method: 12 (Dynamic QR - locked amount!)
    const tag01 = formatTag("01", "12");

    // 3. Merchant Account Information (Individual Bakong Account): Tag 29
    // Sub-tag 00: Account ID (ranntharath@aclb)
    const subTag29_00 = formatTag("00", "ranntharath@aclb");
    const tag29 = formatTag("29", subTag29_00);

    // 4. Merchant Category Code: 5999
    const tag52 = formatTag("52", "5999");

    // 5. Transaction Currency: 840 (USD) or 116 (KHR)
    const tag53 = formatTag("53", currency === "KHR" ? "116" : "840");

    // 6. Transaction Amount (Dynamic): Tag 54
    const tag54 = formatTag("54", amountStr);

    // 7. Country Code: KH
    const tag58 = formatTag("58", "KH");

    // 8. Merchant Name: Rann Tharath
    const tag59 = formatTag("59", "Rann Tharath");

    // 9. Merchant City: Phnom Penh
    const tag60 = formatTag("60", "Phnom Penh");

    // 10. Additional Data Field: Tag 62
    // 03 = Store Label (IRCT SHOP)
    // 02 = Mobile Number (060535771)
    // 01 = Bill Number
    // 07 = Terminal Label (WebQR)
    const subTag62 =
      formatTag("03", "IRCT SHOP") +
      formatTag("02", "060535771") +
      formatTag("01", billNumber) +
      formatTag("07", "WebQR");
    const tag62 = formatTag("62", subTag62);

    // 11. Bakong Dynamic Timestamp & Expiration: Tag 99
    // 00 = Current Timestamp in ms
    // 01 = Expiration Timestamp (1 day later)
    const nowMs = Date.now().toString();
    const expMs = (Date.now() + 86400 * 1000).toString();
    const subTag99 = formatTag("00", nowMs) + formatTag("01", expMs);
    const tag99 = formatTag("99", subTag99);

    // Assemble raw QR before CRC
    const rawQr =
      tag00 +
      tag01 +
      tag29 +
      tag52 +
      tag53 +
      tag54 +
      tag58 +
      tag59 +
      tag60 +
      tag62 +
      tag99 +
      "6304";

    // 12. CRC16 Checksum
    const checksum = crc16(rawQr);
    const dynamicKhqrString = rawQr + checksum;

    // MD5 hash matching Bakong Open API
    const md5 = createHash("md5").update(dynamicKhqrString).digest("hex");

    // Generate high-resolution scannable QR image
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(
      dynamicKhqrString
    )}`;

    // Store in global memory for payment tracking
    const globalStore = globalThis as any;
    globalStore.__BAKONG_TRANSACTIONS__ =
      globalStore.__BAKONG_TRANSACTIONS__ || new Map();
    globalStore.__BAKONG_TRANSACTIONS__.set(md5, {
      bill_number: billNumber,
      amount: amountFloat,
      currency,
      description,
      status: "UNPAID",
      created_at: Date.now(),
    });

    return {
      success: true,
      qr_image: qrImageUrl,
      qr_string: dynamicKhqrString,
      md5,
      bill_number: billNumber,
      amount: amountFloat,
      currency,
      isDynamic: true,
      merchant: "Rann Tharath",
      account: "ranntharath@aclb",
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to generate dynamic Bakong KHQR",
    });
  }
});
