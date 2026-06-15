package mth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class CoreservicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(CoreservicesApplication.class, args);
	}

	@Bean
	public CommandLineRunner initDatabase(JdbcTemplate jdbcTemplate) {
		return args -> {
			try {
				jdbcTemplate.execute("ALTER TABLE products ALTER COLUMN image_url TYPE TEXT;");
				jdbcTemplate.execute("ALTER TABLE order_items ALTER COLUMN image_url TYPE TEXT;");
				System.out.println("✅ Database migration: Altered products.image_url and order_items.image_url to TEXT type successfully.");
			} catch (Exception e) {
				System.out.println("⚠️ Database migration notice: " + e.getMessage());
			}
		};
	}
}
