from flask import Flask, request, jsonify
from flask_cors import CORS
import uuid
from bakong_khqr import KHQR

app = Flask(__name__)
CORS(app)

# Initialize KHQR
khqr = KHQR("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiOWJhN2VkM2IzZWNiNGQ4YiJ9LCJpYXQiOjE3ODg4MzU3NTMsImV4cCI6MTc5NjYxMTc1M30.oFNDF9HT8gYLGp7XxOzkKdUMrQ4zK-6jCZXZiyevfl0")

# In-memory storage for transactions
TRANSACTIONS = {}

@app.route('/api/generate-qr', methods=['POST'])
def generate_qr():
    try:
        data = request.get_json()
        
        if not data or 'amount' not in data or 'currency' not in data:
            return jsonify({'error': 'Missing required fields: amount and currency'}), 400
        
        amount = data['amount']
        currency = data['currency']
        description = data.get('description', 'Payment')
        
        # Generate unique bill number
        bill_number = uuid.uuid4().hex[:12]
        
        # Format amount
        if str(currency).upper() == 'KHR':
            amount_str = str(int(round(float(amount))))
            currency_code = '116'
        else:
            amount_str = f"{float(amount):.2f}"
            currency_code = '840'

        def format_tag(tag_id, val):
            return f"{tag_id}{len(str(val)):02d}{val}"

        def crc16(data: str) -> str:
            crc = 0xFFFF
            for ch in data:
                crc ^= ord(ch) << 8
                for _ in range(8):
                    if crc & 0x8000:
                        crc = ((crc << 1) ^ 0x1021) & 0xFFFF
                    else:
                        crc = (crc << 1) & 0xFFFF
            return f"{crc:04X}"

        # Real ACLEDA KHQR base
        tag00 = format_tag("00", "01")
        tag01 = format_tag("01", "11")
        tag29 = format_tag("29", "0009khqr@aclb0111855235228650206ACLEDA")
        tag39 = format_tag("39", "00042CCY01014")
        tag52 = format_tag("52", "5999")
        tag58 = format_tag("58", "KH")
        tag53 = format_tag("53", currency_code)
        tag54 = format_tag("54", amount_str)
        tag59 = format_tag("59", "365 Sport")
        tag60 = format_tag("60", "Phnom Penh")
        tag62 = format_tag("62", format_tag("02", "0969611977"))

        raw_qr = tag00 + tag01 + tag29 + tag39 + tag52 + tag58 + tag53 + tag54 + tag59 + tag60 + tag62 + "6304"
        checksum = crc16(raw_qr)
        qr_string = raw_qr + checksum

        import hashlib, urllib.parse
        md5 = hashlib.md5(qr_string.encode('utf-8')).hexdigest()
        qr_image = f"https://api.qrserver.com/v1/create-qr-code/?size=350x350&margin=8&data={urllib.parse.quote(qr_string)}"
        
        # Store transaction
        TRANSACTIONS[md5] = {
            'amount': amount,
            'currency': currency,
            'description': description,
            'status': 'UNPAID',
            'bill_number': bill_number
        }
        
        return jsonify({
            'success': True,
            'qr_image': qr_image,
            'qr_string': qr_string,
            'md5': md5,
            'bill_number': bill_number,
            'amount': amount,
            'currency': currency,
            'merchant': '365 Sport'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/check-payment', methods=['GET'])
def check_payment():
    try:
        md5 = request.args.get('md5')
        
        if not md5 or md5 not in TRANSACTIONS:
            return jsonify({'error': 'Invalid transaction ID'}), 400
        
        transaction = TRANSACTIONS[md5]
        status = khqr.check_payment(md5)
        
        # Update transaction status
        if status == 'PAID':
            transaction['status'] = 'PAID'
        
        return jsonify({
            'status': status,
            'transaction': {
                'amount': transaction['amount'],
                'currency': transaction['currency'],
                'description': transaction['description'],
                'bill_number': transaction['bill_number']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'service': 'IRCT Shop Backend'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
