package com.glaze.qrlogin.objects

data class CreateUserRequest(
    val username: String,
    val password: String,
    val email: String,
)