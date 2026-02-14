# Stripe Payment API --- Testing & Running Guide

Dokumentasi ini menjelaskan cara menjalankan server API pembayaran
Stripe serta cara melakukan testing transaksi menggunakan mode sandbox.

------------------------------------------------------------------------

## Requirements

-   [MongoDB](https://www.mongodb.com/docs/manual/installation/)
-   Node.js
-   Stripe Account
-   Stripe CLI ([stripe.exe](https://github.com/stripe/stripe-cli/releases/tag/v1.35.0) - *setting environment variables)

------------------------------------------------------------------------

## Setup Project

### Clone Repository

```bash
    git clone https://github.com/si-udiss/stripe-trial.git
    cd stripe-trial
```

### Install Dependencies

```bash
    npm install
```

------------------------------------------------------------------------

### Environment Variables

Buat file `.env`

```env
    PORT=3000
    STRIPE_SECRET_KEY=sk_test_xxxxx
    STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

------------------------------------------------------------------------

## Run Server

```bash
    npm run dev
```

Server berjalan di:

    http://localhost:3000

------------------------------------------------------------------------

## Endpoint Payment

### POST /api/payment/create-checkout-session

Body:

```json
    {
      "productName": "Test Product",
      "price": 50000,
      "quantity": 1
    }
```

Response:

```json
    {
      "url": "https://checkout.stripe.com/..."
    }
```

Buka URL tersebut di browser untuk melakukan pembayaran.

------------------------------------------------------------------------

## Testing Payment (Sandbox)

  Type       Number
  ---------- ---------------------
  Success    4242 4242 4242 4242
  Declined   4000 0000 0000 0002
  3DS        4000 0025 0000 3155

Exp dan CVC bebas.

------------------------------------------------------------------------

## Webhook Testing

Install CLI:

```bash
    npm install -g stripe
```

Login:

```bash
    stripe login
```

Forward webhook:

```bash
    stripe listen --forward-to localhost:3000/api/webhook
```

Copy webhook secret ke `.env`.

------------------------------------------------------------------------

## Event Used

-   checkout.session.completed
-   payment_intent.succeeded
-   payment_intent.payment_failed

------------------------------------------------------------------------

## Payment Flow

Frontend → Backend → Stripe → Checkout Page → Webhook → Backend

------------------------------------------------------------------------

## Production Checklist

-   Ganti sk_test → sk_live
-   Gunakan HTTPS
-   Set webhook production
-   Enable payment methods
-   Aktifkan fraud protection

------------------------------------------------------------------------

## Struktur Folder

    src/
     ├── routes/
     ├── models/
     └── server.js

------------------------------------------------------------------------

## Notes

Jika pakai Checkout Session, metode pembayaran baru bisa diaktifkan dari
dashboard tanpa ubah kode.

Kalau bingung, tanyain ChatGPT...😂
