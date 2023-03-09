package com.glaze.qrlogin.service

import com.glaze.qrlogin.dtos.response.DisplayUserEventDTO
import com.glaze.qrlogin.dtos.response.UserDTO
import com.glaze.qrlogin.utils.SecurityUtil
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@Service
class EventEmitterService {

    @Value(value = "\${web.app.events.display-user}")
    private lateinit var displayUserEventName: String

    @Value(value = "\${web.app.events.perform-login}")
    private lateinit var performLoginEventName: String

    @Value(value = "\${web.app.events.cancel-login}")
    private lateinit var cancelLoginEventName: String

    fun sendDisplayUserEvent(emitter: SseEmitter, mobileId: String) {
        val authenticatedUser = SecurityUtil.getAuthenticatedUser()
        val userDTO = UserDTO(authenticatedUser.id, authenticatedUser.username, authenticatedUser.profilePicture)
        val data = DisplayUserEventDTO(
            user = userDTO,
            mobileId
        )

        val event = SseEmitter.event()
            .name(displayUserEventName)
            .data(data, MediaType.APPLICATION_JSON)

        emitter.send(event)
    }

    fun sendPerformLoginEvent(emitter: SseEmitter) {
        val event = SseEmitter.event()
            .name(performLoginEventName)
            .data("dummy data")

        emitter.send(event)
        emitter.complete()
    }

    fun sendCancelLoginEventName(emitter: SseEmitter) {
        val event = SseEmitter.event()
                .name(cancelLoginEventName)
                .data("dummy data")

        emitter.send(event)
        emitter.complete()
    }

}
