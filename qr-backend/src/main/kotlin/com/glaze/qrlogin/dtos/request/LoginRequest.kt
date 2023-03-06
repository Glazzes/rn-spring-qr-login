package com.glaze.qrlogin.dtos.request

import jakarta.validation.constraints.Email
import org.hibernate.validator.constraints.Length
import jakarta.validation.constraints.NotBlank

data class LoginRequest(
    @NotBlank(message = "{user.email.required}")
    @Email(message = "{email.not-valid}")
    val email: String,

    @NotBlank(message = "{user.password.required}")
    @Length(min = 8, max = 50, message = "{user.password.length}")
    val password: String,
)
