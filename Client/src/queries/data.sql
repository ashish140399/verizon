ALTER TABLE user_data AUTO_INCREMENT = 1;


CREATE TABLE IF NOT EXISTS app_list(
    appid INT AUTO_INCREMENT PRIMARY KEY,
    app_name TEXT,
    app_id_name TEXT,
    updationtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

INSERT INTO `app_list` (`appid`, `app_id_name`, `app_name`,`updation_time`) VALUES
(1, 'app1', 'Black Rock',  CURRENT_TIMESTAMP),
(2, 'app2', 'Suarez',  CURRENT_TIMESTAMP),
(3, 'app3', 'App 3',  CURRENT_TIMESTAMP),
(4, 'app4', 'App 4',  CURRENT_TIMESTAMP),
(5, 'app5', 'App 5',  CURRENT_TIMESTAMP);

CREATE TABLE IF NOT EXISTS user_data(
    id INT AUTO_INCREMENT PRIMARY KEY,
    userdetails JSON,
    itemname  JSON,
    customizeInfo JSON,
    canvasuri TEXT,
    appname TEXT,
    texttouser JSON,
    usagetime INTEGER,
    updationtime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
ALTER TABLE user_data
ADD COLUMN status VARCHAR(10) DEFAULT 'pending';
ALTER TABLE user_data
ADD COLUMN status_text VARCHAR(10) DEFAULT 'pending';

ALTER TABLE user_data
ADD COLUMN appid INT;

ALTER TABLE user_data
ADD CONSTRAINT appid
FOREIGN KEY (appid) REFERENCES app_list(appid);

CREATE TABLE IF NOT EXISTS inventory_list(
    iv INT AUTO_INCREMENT PRIMARY KEY,
    appid INT, 
    item_name VARCHAR(255),
    img_name  VARCHAR(255),
    used_count INTEGER,
    available_items INTEGER,
    FOREIGN KEY (appid) REFERENCES app_list(appid),
    updation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)



INSERT INTO `inventory_list` (`appid`, `item_name`, `img_name`, `used_count`,`available_items`, `updation_time`) VALUES
(1, 'IP 12 - 12 PRO', 'IP 12 - 12 PRO',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 13 Pro', 'IP 13 Pro',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 13', 'IP 13',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 14 PRO', 'IP 14 PRO',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 14', 'IP 14',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 15 PLUS', 'IP 15 PLUS',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 15 PRO MAX', 'IP 15 PRO MAX',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 15 PRO', 'IP 15 PRO',  0,100, CURRENT_TIMESTAMP),
(1, 'IP 15', 'IP 15',  0,100, CURRENT_TIMESTAMP),
(1, 'S 24', 'S 24',  0,100, CURRENT_TIMESTAMP),
(1, 'S23', 'S23',  0,100, CURRENT_TIMESTAMP);

INSERT INTO `inventory_list` (`appid`,`iv`, `item_name`, `img_name`, `used_count`,`available_items`, `updation_time`) VALUES
(2,1, 'IP 12 - 12 PRO', 'IP 12 - 12 PRO',  0,100, CURRENT_TIMESTAMP),
(2,2, 'IP 13 Pro', 'IP 13 Pro',  0,100, CURRENT_TIMESTAMP),
(2,3, 'IP 13', 'IP 13',  0,100, CURRENT_TIMESTAMP),
(2,4, 'IP 14 PRO', 'IP 14 PRO',  0,100, CURRENT_TIMESTAMP),
(2,5, 'IP 14', 'IP 14',  0,100, CURRENT_TIMESTAMP),
(2,6, 'IP 15 PLUS', 'IP 15 PLUS',  0,100, CURRENT_TIMESTAMP),
(2,7, 'IP 15 PRO MAX', 'IP 15 PRO MAX',  0,100, CURRENT_TIMESTAMP),
(2,8, 'IP 15 PRO', 'IP 15 PRO',  0,100, CURRENT_TIMESTAMP),
(2,9, 'IP 15', 'IP 15',  0,100, CURRENT_TIMESTAMP),
(2,10, 'S 24', 'S 24',  0,100, CURRENT_TIMESTAMP),
(2,11, 'S23', 'S23',  0,100, CURRENT_TIMESTAMP);


CREATE TABLE IF NOT EXISTS graphic_list(
    ig INT AUTO_INCREMENT PRIMARY KEY,
    appname TEXT,
    appid INT, 
    graphic_name VARCHAR(255),
    graphic_img_name  VARCHAR(255),
    graphic_used_count INTEGER,
    graphic_avl_count INTEGER,
    FOREIGN KEY (appid) REFERENCES app_list(appid)
)




INSERT INTO `graphic_list` (`appid`, `graphic_name`, `graphic_img_name`, `graphic_used_count`,`graphic_avl_count`) VALUES
(1, 'BR Pink', '1', 0,100),
(1, 'BR Orange', '2', 0,100),
(1, 'BR Blue', '3', 0,100),
(1, 'BR Roll', '4', 0,100),
(1, 'Bottleneck', '5', 0,100),
(1, 'Napa Valley', '6', 0,100);



INSERT INTO `graphic_list` (`appid`,`ig`, `graphic_name`, `graphic_img_name`, `graphic_used_count`,`graphic_avl_count`) VALUES
(2,1, 'Metro - Horz', '1', 0,100),
(2,2, 'Flower 1', '2', 0,100),
(2,3, 'Flower 2', '3', 0,100),
(2,4, 'Buildings', '4', 0,100),
(2,5, 'Chi Circle', '5', 0,100),
(2,6, 'Circle Train', '6', 0,100),
(2,7, 'Cork Train', '7', 0,100),
(2,8, 'Flags', '8', 0,100),
(2,9, 'Petles', '9', 0,100),
(2,10, 'Suenos', '10', 0,100);