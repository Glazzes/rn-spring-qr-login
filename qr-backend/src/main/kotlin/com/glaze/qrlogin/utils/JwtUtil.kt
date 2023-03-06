package com.glaze.qrlogin.utils

import io.jsonwebtoken.Jwts
import java.time.Instant
import java.time.temporal.ChronoUnit
import java.util.*

object JwtUtil {

    fun createToken(subject: String, time: Long, unit: ChronoUnit): String {
        val issuedAt = Instant.now()
        val expiration = Instant.now()
            .plus(time, unit)

        return Jwts.builder()
            .setSubject(subject)
            .setIssuedAt(Date.from(issuedAt))
            .setExpiration(Date.from(expiration))
            .setIssuer("Kio")
            .compact()
    }

    fun getSubjectFromToken(token: String): String {
        return Jwts.parserBuilder()
            .build()
            .parseClaimsJwt(token)
            .body
            .subject
    }

}
