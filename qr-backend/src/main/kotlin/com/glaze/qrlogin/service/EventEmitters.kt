package com.glaze.qrlogin.service

import org.springframework.stereotype.Component
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter
import java.util.concurrent.ConcurrentHashMap

@Component
class EventEmitters {
    private val emitters: MutableMap<String, SseEmitter> = ConcurrentHashMap()

    fun get(id: String): SseEmitter? {
        return emitters[id]
    }

    fun save(key: String, emitter: SseEmitter) {
        emitters[key] = emitter
    }

    fun remove(key: String) {
        emitters.remove(key)
    }
}