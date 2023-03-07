package com.glaze.qrlogin.controller

import com.glaze.qrlogin.dtos.response.TokenResponseDTO
import com.glaze.qrlogin.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(private val authService: AuthService) {

    /*
    Spring security used to not complain of "hidden" endpoints, this one is for spring security
    not to return a 404 status code, as changing it manually has no effect on the response
     */
    @PostMapping("/login")
    fun login() = ResponseEntity.status(HttpStatus.NO_CONTENT)
        .build<Unit>()


    @PostMapping("/login-qr")
    fun qrLogin() = ResponseEntity.status(HttpStatus.NO_CONTENT)
        .build<Unit>()

    @PostMapping("/token")
    fun getTokenPair(@RequestParam token: String): ResponseEntity<TokenResponseDTO> {
        return ResponseEntity.status(HttpStatus.OK)
            .body(authService.getTokenPair(token))
    }

}
