package com.glaze.qrlogin.objects

data class QrCodeLoginRequest(
    val issuedFor: String,
    val mobileId: String,
    val deviceId: String,
    val deviceName: String,
    val os: String,
    val location: String,
    val ipAddress: String,
)