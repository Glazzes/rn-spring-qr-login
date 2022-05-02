package com.glaze.qrlogin.objects

data class QrCodeLoginRequest(
    val issuedFor: String,
    val mobileId: String,
    val deviceId: String,
)