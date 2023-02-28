package com.glaze.qrlogin.constranints

import jakarta.validation.Constraint
import jakarta.validation.Payload
import kotlin.reflect.KClass

@Retention(value = AnnotationRetention.RUNTIME)
@Target(allowedTargets = [AnnotationTarget.FIELD, AnnotationTarget.PROPERTY_GETTER])
@Constraint(validatedBy = [EmailConstraintValidator::class])
annotation class EmailMustNotExists(
        val message: String = "{user.email.already-in-use}",
        val groups: Array<KClass<*>> = [],
        val payload: Array<KClass<out Payload>> = []
)
