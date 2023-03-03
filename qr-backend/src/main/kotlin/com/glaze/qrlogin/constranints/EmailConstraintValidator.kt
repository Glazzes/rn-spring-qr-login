package com.glaze.qrlogin.constranints

import com.glaze.qrlogin.repositories.UserRepository
import jakarta.validation.ConstraintValidator
import jakarta.validation.ConstraintValidatorContext

class EmailConstraintValidator(
        private val userRepository: UserRepository
): ConstraintValidator<EmailMustNotExists, String> {

    override fun isValid(value: String, context: ConstraintValidatorContext): Boolean {
        return !userRepository.existsByEmail(value)
    }

}
