package com.glaze.qrlogin.validators

import com.glaze.qrlogin.repositories.UserRepository
import javax.validation.ConstraintValidator
import javax.validation.ConstraintValidatorContext

class EmailConstraintValidator(
        private val userRepository: UserRepository
): ConstraintValidator<EmailMustNotExists, String> {

    override fun isValid(value: String, context: ConstraintValidatorContext?): Boolean {
        return !userRepository.existsByEmail(value)
    }
}
