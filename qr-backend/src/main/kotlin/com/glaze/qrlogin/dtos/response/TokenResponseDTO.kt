package com.glaze.qrlogin.dtos.response

data class TokenResponseDTO (
    val accessToken: String,
    val refreshToken: String,
)
