package com.glaze.qrlogin.validators

import javax.validation.Constraint
import javax.validation.Payload
import kotlin.reflect.KClass

@Constraint(validatedBy = [EmailConstraintValidator::class])
@Target(allowedTargets = [AnnotationTarget.FIELD, AnnotationTarget.PROPERTY_GETTER])
@Retention(AnnotationRetention.RUNTIME)
annotation class EmailMustNotExists(
        val message: String = "{user.email.already-in-use}",
        val groups: Array<KClass<*>> = [],
        val payload: Array<KClass<out Payload>> = []
)
