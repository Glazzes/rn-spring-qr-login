package com.glaze.qrlogin.dtos.request

import com.glaze.qrlogin.constranints.EmailMustNotExists
import org.hibernate.validator.constraints.Length
import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank

data class SignUpRequest(
    @NotBlank(message = "{user.username.required}")
    @Length(min = 3, max = 50, message = "{user.username.length}")
    val username: String,

    @NotBlank(message = "{user.password.required}")
    @Length(min = 8, max = 50, message = "{user.password.length}")
    val password: String,

    @EmailMustNotExists
    @Email(message = "{email.not-valid}")
    val email: String,
)
