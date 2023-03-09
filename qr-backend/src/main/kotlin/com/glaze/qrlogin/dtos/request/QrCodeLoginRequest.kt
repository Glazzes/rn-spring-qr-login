package com.glaze.qrlogin.dtos.request

import jakarta.validation.constraints.NotBlank

data class QrCodeLoginRequest(
    @get:NotBlank(message = "{generic.required}")
    val issuedFor: String,

    @get:NotBlank(message = "{generic.required}")
    val mobileId: String,

    @get:NotBlank(message = "{generic.required}")
    val deviceId: String,

    @get:NotBlank(message = "{generic.required}")
    val deviceName: String,

    @get:NotBlank(message = "{generic.required}")
    val os: String,

    @get:NotBlank(message = "{generic.required}")
    val location: String,

    @get:NotBlank(message = "{generic.required}")
    val ipAddress: String,
)
