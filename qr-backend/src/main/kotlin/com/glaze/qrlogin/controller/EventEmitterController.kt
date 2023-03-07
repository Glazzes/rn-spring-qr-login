package com.glaze.qrlogin.controller

import com.glaze.qrlogin.service.EventEmitterService
import com.glaze.qrlogin.service.EventEmitters
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter

@RestController
@RequestMapping("/api/v1/events")
class EventEmitterController(
    private val eventEmitterService: EventEmitterService,
    private val eventEmitters: EventEmitters
){

    private val timeout = 1000 * 60 * 10L

    @GetMapping(path = ["/{id}/register"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun register(@PathVariable id: String) : SseEmitter {
        val emitter = SseEmitter(timeout)

        val runnable = Runnable {
            println("Event emitter removed")
            eventEmitters.remove(id)
        }

        emitter.onTimeout(runnable)
        emitter.onCompletion(runnable)
        emitter.onError{ eventEmitters.remove(id) }

        eventEmitters.save(id, emitter)
        return emitter
    }

    @PostMapping(path = ["/{id}/display-user"])
    fun sendUserShowEvent(
        @PathVariable id:String,
        @RequestParam mobileId: String
    ): ResponseEntity<Unit> {
        val emitter = eventEmitters.get(id) ?:
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .build()

        eventEmitterService.sendDisplayUserEvent(emitter, mobileId)
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

    @PostMapping(path = ["/{id}/login-cancel"])
    fun sendLoginCancelEvent(@PathVariable id: String): ResponseEntity<Unit> {
        val emitter = eventEmitters.get(id) ?:
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .build()

        eventEmitterService.sendCancelLoginEventName(emitter)
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }
    @PostMapping(path = ["/{id}/login-perform"])
    fun sendLoginPerformEvent(@PathVariable id: String): ResponseEntity<Unit> {
        val emitter = eventEmitters.get(id) ?:
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .build()

        eventEmitterService.sendPerformLoginEvent(emitter)
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

}
