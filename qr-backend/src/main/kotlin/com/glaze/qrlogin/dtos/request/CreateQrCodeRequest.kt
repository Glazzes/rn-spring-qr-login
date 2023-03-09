package com.glaze.qrlogin.dtos.request

import jakarta.validation.constraints.NotBlank

data class CreateQrCodeRequest (
    @get:NotBlank(message = "{qr.mobile-id.required}")
    val mobileId: String,

    @get:NotBlank(message = "{qr.device-id.required}")
    val deviceId: String,
)
