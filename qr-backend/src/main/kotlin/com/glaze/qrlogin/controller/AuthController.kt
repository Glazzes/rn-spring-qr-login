package com.glaze.qrlogin.controller

import com.glaze.qrlogin.objects.CreateQrCodeRequest
import com.glaze.qrlogin.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(private val authService: AuthService){

    @PostMapping("/qr/register")
    fun saveQrRequest(@RequestBody createQrRequest: CreateQrCodeRequest): ResponseEntity<Unit> {
        authService.saveRequest(createQrRequest)
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

    /*
    Spring security used to not complain of "hidden" endpoints, this one is for spring security
    not to return a 404 status code, as changing it manually has no effect on the response
     */
    @PostMapping("/login")
    fun usernamePasswordLogin(): ResponseEntity<Unit> {
        return ResponseEntity.noContent().build()
    }

}