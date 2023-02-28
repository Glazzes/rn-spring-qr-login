package com.glaze.qrlogin.dtos.request

import jakarta.validation.constraints.NotBlank

data class QrCodeLoginRequest(
    @NotBlank(message = "{generic.required}")
    val issuedFor: String,

    @NotBlank(message = "{generic.required}")
    val mobileId: String,

    @NotBlank(message = "{generic.required}")
    val deviceId: String,

    @NotBlank(message = "{generic.required}")
    val deviceName: String,

    @NotBlank(message = "{generic.required}")
    val os: String,

    @NotBlank(message = "{generic.required}")
    val location: String,

    @NotBlank(message = "{generic.required}")
    val ipAddress: String,
)
