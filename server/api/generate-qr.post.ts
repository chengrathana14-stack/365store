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
    const amount = Number(body?.amount || 0);
    const currency = body?.currency === "KHR" ? "KHR" : "USD";
    const description = body?.description || "Order Payment";

    const billNumber = randomBytes(6).toString("hex").toUpperCase();

    // Standard EMVCo Tags for Cambodian KHQR (Bakong)
    const payloadFormat = formatTag("00", "01");
    const initiationMethod = formatTag("01", "12"); // Dynamic QR
    const accountInfo = formatTag(
      "29",
      formatTag("00", "ranntharath@aclb") + formatTag("01", "IRCT SHOP")
    );
    const mcc = formatTag("52", "5999");
    const currCode = formatTag("53", currency === "KHR" ? "116" : "840");
    const amtStr = formatTag("54", amount.toFixed(2));
    const country = formatTag("58", "KH");
    const merchantName = formatTag("59", "Rann Tharath");
    const merchantCity = formatTag("60", "Phnom Penh");
    const additionalData = formatTag(
      "62",
      formatTag("01", billNumber) +
        formatTag("02", "060535771") +
        formatTag("07", "WebQR")
    );

    const rawQr =
      payloadFormat +
      initiationMethod +
      accountInfo +
      mcc +
      currCode +
      amtStr +
      country +
      merchantName +
      merchantCity +
      additionalData +
      "6304";

    const checksum = crc16(rawQr);
    const finalQrString = rawQr + checksum;
    const md5 = createHash("md5").update(finalQrString).digest("hex");

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&data=${encodeURIComponent(
      finalQrString
    )}`;

    const globalStore = globalThis as any;
    globalStore.__BAKONG_TRANSACTIONS__ =
      globalStore.__BAKONG_TRANSACTIONS__ || new Map();
    globalStore.__BAKONG_TRANSACTIONS__.set(md5, {
      bill_number: billNumber,
      amount,
      currency,
      description,
      status: "UNPAID",
      created_at: Date.now(),
    });

    return {
      success: true,
      qr_image: qrImageUrl,
      qr_string: finalQrString,
      md5,
      bill_number: billNumber,
      amount,
      currency,
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to generate Bakong KHQR",
    });
  }
});
