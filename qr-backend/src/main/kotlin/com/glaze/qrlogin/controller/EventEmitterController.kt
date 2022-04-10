package com.glaze.qrlogin.controller

import com.glaze.qrlogin.service.EventEmitterService
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.concurrent.ConcurrentHashMap

@RestController
@RequestMapping("/api/v1/events")
class EventEmitterController(private val eventEmitterService: EventEmitterService){

    private val timeout = 1000 * 60 * 5L
    private val eventEmitters = ConcurrentHashMap<String, SseEmitter>()

    @GetMapping(path = ["/{id}/register"], produces = [MediaType.TEXT_EVENT_STREAM_VALUE])
    fun register(@PathVariable id: String) : SseEmitter {
        val emitter = SseEmitter(timeout)
        val runnable = Runnable { eventEmitters.remove(id) }
        emitter.onTimeout(runnable)
        emitter.onCompletion(runnable)
        return emitter
    }

    @PostMapping(path = ["/{id}/user-show"])
    fun sendUserShowEvent(@PathVariable id:String): ResponseEntity<Unit> {
        val emitter = eventEmitters[id] ?:
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .build()

        eventEmitterService.sendUserShowEvent(emitter)
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

    @PostMapping(path = ["/{id}/login-cancel"])
    fun sendLoginCancelEvent(@PathVariable id: String): ResponseEntity<Unit> {
        val emitter = eventEmitters[id] ?:
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .build()

        eventEmitterService.sendLoginEvent(emitter, "login.cancel")
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }
    @PostMapping(path = ["/{id}/login-perform"])
    fun sendLoginPerformEvent(@PathVariable id: String): ResponseEntity<Unit> {
        val emitter = eventEmitters[id] ?:
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .build()

        eventEmitterService.sendLoginEvent(emitter, "login.perform")
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }


    @DeleteMapping(path = ["/{id}"])
    fun delete(@PathVariable id: String): ResponseEntity<Unit> {
        eventEmitters.remove(id)
        return ResponseEntity.status(HttpStatus.NO_CONTENT)
            .build()
    }

}