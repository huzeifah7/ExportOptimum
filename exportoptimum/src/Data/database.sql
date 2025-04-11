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
-- Dumping data for table `assurances`
--

LOCK TABLES `assurances` WRITE;
/*!40000 ALTER TABLE `assurances` DISABLE KEYS */;
INSERT INTO `assurances` VALUES (1,1,'BRC Food test','/BRC.png'),(2,1,'Global GAP','/GLOBALGAP.png'),(3,1,'BIO Certification','/BIO.jpg'),(4,1,'ISO Certified test','/spring.png');
/*!40000 ALTER TABLE `assurances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,'First Blog Post','Author One','2023-12-31','This is a summary of the first blog post.','/BlogsImages/download.jpg','technology','This is the full content of the first blog post. \nHere, we dive deeper into the topic of technology advancements in 2024.'),(2,'Test update post','Houdiafa El baal','2025-02-19','This is a summary of the second blog post. test 2','/BlogsImages/1740409361193.jpeg','lifestyle','In this post, we explore how lifestyle changes are reshaping our everyday habits and routines. test2'),(3,'Test Add blog ','Houdaifa','2026-02-03','Test data was sended to Database ','/BlogsImages/1740409706469.jpg','Lifestyle','Successfully sending ');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `key_figures`
--

LOCK TABLES `key_figures` WRITE;
/*!40000 ALTER TABLE `key_figures` DISABLE KEYS */;
INSERT INTO `key_figures` VALUES (1,'Tons of yearly export',50000,'tons'),(2,'Employees',115,'employee'),(3,'Major Customers',55,'customer');
/*!40000 ALTER TABLE `key_figures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'John Doe','john@example.com','','Hello','This is a test message');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Hass','Fresh avocado from organic farms.','Hass avocados are celebrated for their creamy texture and nutty flavor, making them the preferred choice for culinary enthusiasts worldwide. They are rich in essential nutrients such as healthy fats, fiber, and potassium, supporting heart health and overall wellness. With their distinct pebbly skin and vibrant green flesh, Hass avocados are versatile and ideal for a wide range of dishes, from guacamole to salads and even smoothies. Carefully cultivated in organic farms, these avocados guarantee freshness, quality, and sustainability, providing a gourmet experience with every bite.','/ProductsImages/Hass.jpg','[\"/ProductsImages/Hass1.jpg\", \"/ProductsImages/Hass2.jpg\", \"/ProductsImages/Hass3.jpg\"]'),(2,'Fuerte','Creamy and ripe avocados.','The Fuerte avocado is a timeless classic, loved for its smooth, buttery texture and mild, nutty flavor. This variety is characterized by its thin, green skin, making it easy to peel and enjoy. Rich in vitamins, antioxidants, and healthy fats, Fuerte avocados are a nutritional powerhouse. Whether sliced into a salad, blended into a creamy dip, or spread on toast, they offer a versatile and delicious addition to any meal. Our Fuerte avocados are cultivated with care, ensuring freshness and exceptional quality for all your culinary needs.','/ProductsImages/Fuerte.jpg','[\"/ProductsImages/Fuerte1.jpg\", \"/ProductsImages/Fuerte2.jpg\", \"/ProductsImages/Fuerte3.jpg\"]'),(3,'Zutano','Perfect for guacamole.','Zutano avocados are known for their light, mild flavor and smooth texture, making them a refreshing choice for salads, salsas, and guacamole. Their glossy, thin skin and pear-like shape add a unique appeal. Packed with essential nutrients such as vitamins C, E, and B6, Zutano avocados provide a healthy boost to your diet. Grown in the finest orchards, these avocados are carefully handpicked to ensure premium quality and freshness. Enjoy the delicate taste and versatile nature of Zutano avocados, perfect for enhancing your favorite dishes.','/ProductsImages/Zutano.jpg','[\"/ProductsImages/Zutano1.jpg\", \"/ProductsImages/Zutano2.jpg\", \"/ProductsImages/Zutano3.jpg\"]'),(5,'Reed','A large and flavorful avocado.','Reed avocados are prized for their large size, creamy texture, and bold flavor. These round avocados have thick, green skin that protects the vibrant yellow-green flesh within. Known for their exceptional creaminess, Reed avocados are perfect for creating luxurious guacamole, spreads, or desserts. They are packed with monounsaturated fats, vitamins, and antioxidants, promoting heart health and overall well-being. Grown with dedication to quality, Reed avocados offer a delightful eating experience that satisfies the palate and nourishes the body.','/ProductsImages/Reed.jpg','[\"/ProductsImages/Reed1.jpg\", \"/ProductsImages/Reed2.jpg\", \"/ProductsImages/Reed3.jpg\"]'),(8,'Pinkton ','Good Avocado ','Here','/ProductsImages/1740340408912-âPngtreeâfresh avocado transparent background_15744100 (1).png','[\"/ProductsImages/1740340409022-pngwing.com (1).png\", \"/ProductsImages/1740340409049-pngwing.com.png\", \"/ProductsImages/1740340409103-âPngtreeâphoto of avocado_8939900.png\"]');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `qualityassuranceparagraphs`
--

LOCK TABLES `qualityassuranceparagraphs` WRITE;
/*!40000 ALTER TABLE `qualityassuranceparagraphs` DISABLE KEYS */;
INSERT INTO `qualityassuranceparagraphs` VALUES (1,'We start our quality control process from the downstream of the supply chain. Before picking the fruit from the farm we send our quality specialist to approve the parcel based on our costumer specifications and tolerance , fruit is controlled one more time at reception and again during production process, the lot is only liberated if it does meet all costumer requirements. For export optimum quality is the key of continuity.');
/*!40000 ALTER TABLE `qualityassuranceparagraphs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Houdaifa El baal','AdminImages/profile-1741303488136-milad-fakurian-58Z17lnVS4U-unsplash.jpg','Admin','Admin@mail.com','$2b$10$qCRS6CSVo64N5YzNoyUnV.tdS1XAAx0cXMRBp/g5U4iaX2OMWvB2.');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-11 12:43:40
