package com.glaze.qrlogin.utils

import org.springframework.web.multipart.MultipartFile
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody
import java.io.FileInputStream
import java.nio.file.Paths
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.UUID

object FileUtil {
    private val tmpDir = System.getProperty("java.io.tmpdir")
    private val formatter = DateTimeFormatter.ofPattern("ddMMyyyy", Locale.ENGLISH)

    /**
     * Saves the user picture to the OS tmp dir and returns the filename for static handling
     */
    fun save(file: MultipartFile): String {
        val now = formatter.format(LocalDate.now())
        val filename = UUID.randomUUID().toString() + now + ".jpeg"
        val path = Paths.get("${tmpDir}/$filename")
        file.transferTo(path)

        return filename
    }

    fun findByName(filename: String) = StreamingResponseBody { out ->
        val path = Paths.get("${tmpDir}/$filename")

        FileInputStream(path.toFile()).use { input ->
            val buffer = ByteArray(4096)
            while (input.read(buffer) != -1) {
                out.write(buffer)
            }

            out.close()
        }
    }

}
