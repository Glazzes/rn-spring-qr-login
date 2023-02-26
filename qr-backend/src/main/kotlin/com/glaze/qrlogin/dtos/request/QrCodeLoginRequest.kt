package com.glaze.qrlogin.dtos.request

data class QrCodeLoginRequest(
    val issuedFor: String,
    val mobileId: String,
    val deviceId: String,
    val deviceName: String,
    val os: String,
    val location: String,
    val ipAddress: String,
)
