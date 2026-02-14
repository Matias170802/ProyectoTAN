package com.tan.seminario.backend.CasosDeUsos.Seguridad.Email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Servicio para envío de emails del sistema
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.mail.from}")
    private String fromEmail;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Value("${app.security.password-reset.token-expiration-hours}")
    private int tokenExpirationHours;

    /**
     * Envía email de recuperación de contraseña
     *
     * @param destinatario Email del usuario
     * @param nombreUsuario Nombre del usuario
     * @param token Token de recuperación
     */
    @Async
    public void enviarEmailRecuperacionPassword(String destinatario, String nombreUsuario, String token) {
        try {
            log.info("Preparando email de recuperación de contraseña para: {}", destinatario);

            // Generar el link de recuperación
            String resetLink = String.format("%s/reset-password?token=%s", frontendUrl, token);

            // Preparar el contexto del template
            Context context = new Context();
            context.setVariable("nombreUsuario", nombreUsuario);
            context.setVariable("resetLink", resetLink);
            context.setVariable("expirationHours", tokenExpirationHours);
            context.setVariable("currentYear", LocalDateTime.now().getYear());

            // Generar el HTML desde el template
            String htmlContent = templateEngine.process("email/password-reset", context);

            // Crear el mensaje
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(destinatario);
            helper.setSubject("Recuperación de Contraseña - Sistema TAN");
            helper.setText(htmlContent, true); // true = es HTML

            // Enviar
            mailSender.send(message);

            log.info("✅ Email de recuperación enviado exitosamente a: {}", destinatario);

        } catch (MessagingException e) {
            log.error("❌ Error al enviar email de recuperación a {}: {}", destinatario, e.getMessage());
            throw new RuntimeException("No se pudo enviar el email de recuperación", e);
        } catch (Exception e) {
            log.error("❌ Error inesperado al enviar email: {}", e.getMessage());
            throw new RuntimeException("Error al procesar el email", e);
        }
    }

    /**
     * Envía email de confirmación de cambio de contraseña
     *
     * @param destinatario Email del usuario
     * @param nombreUsuario Nombre del usuario
     */
    @Async
    public void enviarEmailConfirmacionCambioPassword(String destinatario, String nombreUsuario) {
        try {
            log.info("Enviando confirmación de cambio de contraseña a: {}", destinatario);

            Context context = new Context();
            context.setVariable("nombreUsuario", nombreUsuario);
            context.setVariable("fechaCambio", LocalDateTime.now().format(
                    DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")
            ));
            context.setVariable("currentYear", LocalDateTime.now().getYear());

            String htmlContent = templateEngine.process("email/password-changed", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(destinatario);
            helper.setSubject("Tu contraseña ha sido modificada - Sistema TAN");
            helper.setText(htmlContent, true);

            mailSender.send(message);

            log.info("✅ Email de confirmación enviado exitosamente a: {}", destinatario);

        } catch (Exception e) {
            log.error("❌ Error al enviar email de confirmación a {}: {}", destinatario, e.getMessage());
            // No lanzamos excepción aquí porque es solo notificación
        }
    }

    /**
     * Envía email de bienvenida a nuevo empleado
     *
     * @param destinatario Email del empleado
     * @param nombreEmpleado Nombre del empleado
     * @param codEmpleado Código del empleado
     * @param passwordTemporal Contraseña temporal (opcional)
     */
    @Async
    public void enviarEmailBienvenidaEmpleado(
            String destinatario,
            String nombreEmpleado,
            String codEmpleado,
            String passwordTemporal
    ) {
        try {
            log.info("Enviando email de bienvenida a nuevo empleado: {}", destinatario);

            Context context = new Context();
            context.setVariable("nombreEmpleado", nombreEmpleado);
            context.setVariable("codEmpleado", codEmpleado);
            context.setVariable("email", destinatario);
            context.setVariable("passwordTemporal", passwordTemporal);
            context.setVariable("loginUrl", frontendUrl + "/login");
            context.setVariable("currentYear", LocalDateTime.now().getYear());

            String htmlContent = templateEngine.process("email/welcome-employee", context);

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, fromName);
            helper.setTo(destinatario);
            helper.setSubject("Bienvenido al Sistema TAN - Credenciales de Acceso");
            helper.setText(htmlContent, true);

            mailSender.send(message);

            log.info("✅ Email de bienvenida enviado exitosamente a: {}", destinatario);

        } catch (Exception e) {
            log.error("❌ Error al enviar email de bienvenida a {}: {}", destinatario, e.getMessage());
        }
    }

    /**
     * Método simple para enviar emails de texto plano (fallback)
     */
    public void enviarEmailSimple(String destinatario, String asunto, String mensaje) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(destinatario);
            message.setSubject(asunto);
            message.setText(mensaje);

            mailSender.send(message);
            log.info("✅ Email simple enviado a: {}", destinatario);

        } catch (Exception e) {
            log.error("❌ Error al enviar email simple a {}: {}", destinatario, e.getMessage());
            throw new RuntimeException("Error al enviar email", e);
        }
    }
}