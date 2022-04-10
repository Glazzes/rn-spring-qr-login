package com.glaze.qrlogin.objects

data class QrCodeRequest (
    val issuedFor: String,
    val mobileId: String,
    val deviceId: String
)