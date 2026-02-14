package com.tan.seminario.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

//@Component // Descomenta para activar el test
public class EmailTestRunner implements CommandLineRunner {

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void run(String... args) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("sistematan@gmail.com");
            message.setTo("sistematan@gmail.com"); // Envía a ti mismo
            message.setSubject("Test de Configuración Email");
            message.setText("✅ Si recibes este email, la configuración está correcta!");

            mailSender.send(message);
            System.out.println("\n✅ EMAIL DE PRUEBA ENVIADO EXITOSAMENTE");
            System.out.println("📧 Revisa tu bandeja de entrada: sistematan@gmail.com\n");

        } catch (Exception e) {
            System.err.println("\n❌ ERROR AL ENVIAR EMAIL:");
            System.err.println(e.getMessage());
            e.printStackTrace();
        }
    }
}