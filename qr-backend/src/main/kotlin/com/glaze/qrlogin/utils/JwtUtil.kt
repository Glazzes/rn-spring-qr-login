package com.glaze.qrlogin.utils

import io.jsonwebtoken.Jwts
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

object JwtUtil {

    fun createToken(subject: String): String {
        val issuedAt = Instant.now()
        val expiration = Instant.now()
            .plus(15L, ChronoUnit.MINUTES)

        return Jwts.builder()
            .setSubject(subject)
            .setExpiration(Date.from(expiration))
            .setIssuedAt(Date.from(issuedAt))
            .setIssuer("Kio")
            .compact()
    }

}