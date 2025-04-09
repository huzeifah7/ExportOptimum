-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: exportoptimum
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `MoreDescription` text,
  `mainImage` varchar(255) DEFAULT NULL,
  `images` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Hass','Fresh avocado from organic farms.','Hass avocados are celebrated for their creamy texture and nutty flavor, making them the preferred choice for culinary enthusiasts worldwide. They are rich in essential nutrients such as healthy fats, fiber, and potassium, supporting heart health and overall wellness. With their distinct pebbly skin and vibrant green flesh, Hass avocados are versatile and ideal for a wide range of dishes, from guacamole to salads and even smoothies. Carefully cultivated in organic farms, these avocados guarantee freshness, quality, and sustainability, providing a gourmet experience with every bite.','/ProductsImages/Hass.jpg','[\"/ProductsImages/Hass1.jpg\", \"/ProductsImages/Hass2.jpg\", \"/ProductsImages/Hass3.jpg\"]'),(2,'Fuerte','Creamy and ripe avocados.','The Fuerte avocado is a timeless classic, loved for its smooth, buttery texture and mild, nutty flavor. This variety is characterized by its thin, green skin, making it easy to peel and enjoy. Rich in vitamins, antioxidants, and healthy fats, Fuerte avocados are a nutritional powerhouse. Whether sliced into a salad, blended into a creamy dip, or spread on toast, they offer a versatile and delicious addition to any meal. Our Fuerte avocados are cultivated with care, ensuring freshness and exceptional quality for all your culinary needs.','/ProductsImages/Fuerte.jpg','[\"/ProductsImages/Fuerte1.jpg\", \"/ProductsImages/Fuerte2.jpg\", \"/ProductsImages/Fuerte3.jpg\"]'),(3,'Zutano','Perfect for guacamole.','Zutano avocados are known for their light, mild flavor and smooth texture, making them a refreshing choice for salads, salsas, and guacamole. Their glossy, thin skin and pear-like shape add a unique appeal. Packed with essential nutrients such as vitamins C, E, and B6, Zutano avocados provide a healthy boost to your diet. Grown in the finest orchards, these avocados are carefully handpicked to ensure premium quality and freshness. Enjoy the delicate taste and versatile nature of Zutano avocados, perfect for enhancing your favorite dishes.','/ProductsImages/Zutano.jpg','[\"/ProductsImages/Zutano1.jpg\", \"/ProductsImages/Zutano2.jpg\", \"/ProductsImages/Zutano3.jpg\"]'),(5,'Reed','A large and flavorful avocado.','Reed avocados are prized for their large size, creamy texture, and bold flavor. These round avocados have thick, green skin that protects the vibrant yellow-green flesh within. Known for their exceptional creaminess, Reed avocados are perfect for creating luxurious guacamole, spreads, or desserts. They are packed with monounsaturated fats, vitamins, and antioxidants, promoting heart health and overall well-being. Grown with dedication to quality, Reed avocados offer a delightful eating experience that satisfies the palate and nourishes the body.','/ProductsImages/Reed.jpg','[\"/ProductsImages/Reed1.jpg\", \"/ProductsImages/Reed2.jpg\", \"/ProductsImages/Reed3.jpg\"]'),(8,'Pinkton ','Good Avocado ','Here','/ProductsImages/1740340408912-âPngtreeâfresh avocado transparent background_15744100 (1).png','[\"/ProductsImages/1740340409022-pngwing.com (1).png\", \"/ProductsImages/1740340409049-pngwing.com.png\", \"/ProductsImages/1740340409103-âPngtreeâphoto of avocado_8939900.png\"]');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-01 15:05:02
