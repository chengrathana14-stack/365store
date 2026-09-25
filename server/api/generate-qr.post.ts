import QRCode from "qrcode";
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

    // Format amount based on currency
    // USD: 2 decimal places (e.g. "25.00")
    // KHR: integer format (e.g. "102500")
    let amountStr = "";
    if (currency === "KHR") {
      amountStr = Math.round(amountFloat).toString();
    } else {
      amountStr = amountFloat.toFixed(2);
    }

    const billNumber = randomBytes(6).toString("hex").toUpperCase();

    // Exact user's real ACLEDA KHQR structure:
    // Tag 00: Payload Format Indicator (01)
    const tag00 = formatTag("00", "01");

    // Tag 01: Point of Initiation Method (11: Static QR with amount)
    const tag01 = formatTag("01", "11");

    // Tag 29: ACLEDA Merchant Account Information
    // 00 = khqr@aclb | 01 = 85523522865 | 02 = ACLEDA
    const tag29 = formatTag("29", "0009khqr@aclb0111855235228650206ACLEDA");

    // Tag 39: ACLEDA Dual Currency Account (2CCY)
    const tag39 = formatTag("39", "00042CCY01014");

    // Tag 52: Merchant Category Code (5999)
    const tag52 = formatTag("52", "5999");

    // Tag 58: Country Code (KH)
    const tag58 = formatTag("58", "KH");

    // Tag 53: Transaction Currency (840 for USD, 116 for KHR)
    const tag53 = formatTag("53", currency === "KHR" ? "116" : "840");

    // Tag 54: Transaction Amount (Determined from product/order price)
    const tag54 = formatTag("54", amountStr);

    // Tag 59: Merchant Name (CHENG ROTANA - registered with ACLEDA Bank)
    const tag59 = formatTag("59", "CHENG ROTANA");

    // Tag 60: Merchant City (Phnom Penh)
    const tag60 = formatTag("60", "Phnom Penh");

    // Tag 62: Additional Data Field (Mobile: 0969611977)
    const tag62 = formatTag("62", formatTag("02", "0969611977"));

    // Assemble raw string before CRC16
    const rawQr =
      tag00 +
      tag01 +
      tag29 +
      tag39 +
      tag52 +
      tag58 +
      tag53 +
      tag54 +
      tag59 +
      tag60 +
      tag62 +
      "6304";

    // Tag 63: CRC16 Checksum
    const checksum = crc16(rawQr);
    const khqrString = rawQr + checksum;

    // Generate MD5 hash for payment tracking
    const md5 = createHash("md5").update(khqrString).digest("hex");

    // High resolution scannable QR code (Data URL with Level H error correction)
    let qrImageUrl = "";
    try {
      qrImageUrl = await QRCode.toDataURL(khqrString, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 360,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    } catch {
      qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=8&data=${encodeURIComponent(
        khqrString
      )}`;
    }

    // Store in global memory for payment status polling
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
      qr_string: khqrString,
      md5,
      bill_number: billNumber,
      amount: amountFloat,
      currency,
      merchant: "CHENG ROTANA",
      store: "365 Sport",
    };
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      statusMessage: err.message || "Failed to generate Bakong KHQR",
    });
  }
});
