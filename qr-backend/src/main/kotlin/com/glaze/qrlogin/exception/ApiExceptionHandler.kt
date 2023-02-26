package com.glaze.qrlogin.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.BindException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.LocalDateTime

@RestControllerAdvice
class ApiExceptionHandler {

    data class ExceptionDetails(
        val timeStamp: LocalDateTime,
        val message: String
    )

    @ExceptionHandler(value = [AssociationException::class])
    fun handleAssociationException(e: RuntimeException): ResponseEntity<*> {
        return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(ExceptionDetails(LocalDateTime.now(), e.message!!))
    }

    @ExceptionHandler(value = [BindException::class])
    fun handleBindException(e: BindException): ResponseEntity<*> {
        val errors = e.fieldErrors
                .associateBy( {it.field}, {it.defaultMessage} )

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(errors)
    }

}
