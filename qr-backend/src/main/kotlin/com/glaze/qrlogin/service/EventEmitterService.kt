package com.glaze.qrlogin.service

import com.glaze.qrlogin.entities.dto.UserDTO
import com.glaze.qrlogin.utils.SecurityUtil
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class EventEmitterService {

    fun sendUserShowEvent(emitter: SseEmitter) {
        val authenticatedUser = SecurityUtil.getAuthenticatedUser()
        val data = UserDTO(authenticatedUser.username, authenticatedUser.profilePicture)

        val event = SseEmitter.event()
            .name("user.show")
            .data(data, MediaType.APPLICATION_JSON)

        emitter.send(event)
    }

    fun sendLoginEvent(emitter: SseEmitter, eventName: String) {
        val event = SseEmitter.event()
            .name(eventName)
            .data("dummy data")

        emitter.send(event)
    }

}