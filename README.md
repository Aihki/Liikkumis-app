## LiikkumisApp

LiikkumisApp on käyttäjää tukeva urheilu aplikaatio. Käyttäjä pystyy seuraamaa miten hän on edistyny, voi seurata omaa ruokavaliotaan sekä tehä itselleen workoutteja mitä nuodattaa.

## Rautalankamalli
[Rautalankamalli](https://www.figma.com/file/C4hgU6YZl7PF0OLEaqAC9a/Untitled?type=design&node-id=1-5&mode=design&t=JBFiQK2WytOM06tc-0)

## Backend
* [upload-server](https://liikkumisapp.northeurope.cloudapp.azure.com/upload-api/api/v1/)
* [auth-server](https://liikkumisapp.northeurope.cloudapp.azure.com/auth-api/api/v1)
* [training-server](https://liikkumisapp.northeurope.cloudapp.azure.com/training-api/api/v1)

## apidocs
* [upload-server](https://liikkumisapp.northeurope.cloudapp.azure.com/upload-api/)
* [auth-server](https://liikkumisapp.northeurope.cloudapp.azure.com/auth-api/)
* [training-server](https://liikkumisapp.northeurope.cloudapp.azure.com/training-api/)

## backend testaukset
* [ci/cd](https://github.com/Aihki/Liikkumis-app-be/actions)
* [integraatio testaukset](https://github.com/Aihki/Liikkumis-app-be/tree/training-server/training-server/test)


## Tietokannan kuvaus

* [tietokanta](ss/liikkumisApp_diagram.png)

``` sql
-- Drop the database if it exists and then create it
  DROP DATABASE IF EXISTS LiikkumisApp;
  CREATE DATABASE LiikkumisApp;
  USE LiikkumisApp;

  -- Create the tables

  CREATE TABLE UserLevels (
      level_id INT AUTO_INCREMENT PRIMARY KEY,
      level_name VARCHAR(50) NOT NULL
  );

  CREATE TABLE Users (
      user_id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      user_level_id INT,
      user_profile_pic VARCHAR(255),
      user_banner_pic VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
  );

    CREATE TABLE FoodDiary (
        food_diary_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        food_diary_date DATE,
        food_diary_notes VARCHAR(255),
        food_diary_ingredients VARCHAR(255),
        food_diary_meal VARCHAR(255),
        food_diary_calories INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );

    CREATE TABLE UserWorkouts (
        user_workout_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        workout_type ENUM('Gym', 'Body Weight', 'Cardio') NOT NULL,
        workout_status ENUM('completed', 'pending') NOT NULL DEFAULT 'pending',
        workout_date DATE,
        workout_name VARCHAR(50),
        workout_description VARCHAR(200),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );

    CREATE TABLE Exercises (
        exercise_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        user_workout_id INT,
        exercise_name VARCHAR(50),
        exercise_weight INT,
        exercise_reps INT,
        exercise_sets INT,
        exercise_completed TINYINT(1) DEFAULT 0,
        exercise_duration INT,
        exercise_distance INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_workout_id) REFERENCES UserWorkouts(user_workout_id)
    );

    CREATE TABLE PersonalBests (
    pb_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    exercise_name VARCHAR(50),
    max_weight INT,
    record_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );

    CREATE TABLE Challenges (
        challenge_id INT AUTO_INCREMENT PRIMARY KEY,
        challenge_name VARCHAR(255) NOT NULL,
        description TEXT,
        start_date DATE,
        end_date DATE,
        target_type ENUM('Distance', 'Weight', 'Time', 'Repetition', 'Body Weight Repetition') NOT NULL,
        target_value DECIMAL(10,2) NOT NULL,
        active BOOLEAN DEFAULT TRUE
    );

    CREATE TABLE UserChallenges (
        user_challenge_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        challenge_id INT,
        start_date DATE DEFAULT CURRENT_DATE,
        progress DECIMAL(10,2) DEFAULT 0,
        completed BOOLEAN DEFAULT FALSE,
        completion_date DATE,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (challenge_id) REFERENCES Challenges(challenge_id)
    );

    CREATE TABLE Achievements (
        achievement_id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        criterion ENUM('CompleteChallenge', 'ReachTarget') NOT NULL,
        criterion_detail VARCHAR(255) NOT NULL
    );

    CREATE TABLE UserAchievements (
        user_achievement_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        achievement_id INT,
        achieved_on DATE DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Users(user_id),
        FOREIGN KEY (achievement_id) REFERENCES Achievements(achievement_id)
    );


    CREATE TABLE UserProgress (
        progress_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        progress_image VARCHAR(255),
        progress_date DATE,
        progress_weight INT,
        progress_height INT,
        progress_circumference_chest INT,
        progress_circumference_waist INT,
        progress_circumference_thigh_r INT,
        progress_circumference_thigh_l INT,
        progress_circumference_bicep_r INT,
        progress_circumference_bicep_l INT,
        progress_circumference_calves_r INT,
        progress_circumference_calves_l INT,
        FOREIGN KEY (user_id) REFERENCES Users(user_id)
    );

    INSERT INTO Challenges
    (challenge_name, description, start_date, end_date, target_type, target_value, active) VALUES
    ('Bronze Running', 'Complete 50 kilometers of running.', CURRENT_DATE, '9999-12-31', 'Distance', 50.00, TRUE),
    ('Silver Running', 'Complete 250 kilometers of running.', CURRENT_DATE, '9999-12-31', 'Distance', 250.00, TRUE),
    ('Gold Running', 'Complete 500 kilometers of running.', CURRENT_DATE, '9999-12-31', 'Distance', 500.00, TRUE),
    ('Platinum Running', 'Complete 1000 kilometers of running.', CURRENT_DATE, '9999-12-31', 'Distance', 1000.00, TRUE);


    INSERT INTO Challenges
    (challenge_name, description, start_date, end_date, target_type, target_value, active) VALUES
    ('Bronze Strength', 'Complete 100 repetitions of any strength exercises.', CURRENT_DATE, '9999-12-31', 'Repetition', 100.00, TRUE),
    ('Silver Strength', 'Complete 500 repetitions of any strength exercises.', CURRENT_DATE, '9999-12-31', 'Repetition', 500.00, TRUE),
    ('Gold Strength', 'Complete 1000 repetitions of any strength exercises.', CURRENT_DATE, '9999-12-31', 'Repetition', 1000.00, TRUE),
    ('Platinum Strength', 'Achieve a grand total of 10000 repetitions across all your workouts.', CURRENT_DATE, '9999-12-31', 'Repetition', 10000.00, TRUE);

    INSERT INTO Challenges
    (challenge_name, description, start_date, end_date, target_type, target_value, active) VALUES
    ('Bronze Bodyweight', 'Complete 100 repetitions of any bodyweight exercises.', CURRENT_DATE, '9999-12-31', 'Body Weight Repetition', 100.00, TRUE),
    ('Silver Bodyweight', 'Complete 500 repetitions of any bodyweight exercises.', CURRENT_DATE, '9999-12-31', 'Body Weight Repetition', 500.00, TRUE),
    ('Gold Bodyweight', 'Complete 1000 repetitions of any bodyweight exercises.', CURRENT_DATE, '9999-12-31', 'Body Weight Repetition', 1000.00, TRUE),
    ('Platinum Bodyweight', 'Achieve a grand total of 10000 repetitions across all your bodyweight workouts.', CURRENT_DATE, '9999-12-31', 'Body Weight Repetition', 10000.00, TRUE);

    INSERT INTO Achievements
    (title, description, criterion, criterion_detail) VALUES
    ('Bronze Strength', 'Awarded for completing the Bronze Strength Challenge.', 'CompleteChallenge', 'Bronze Strength'),
    ('Silver Strength', 'Awarded for completing the Silver Strength Challenge.', 'CompleteChallenge', 'Silver Strength'),
    ('Gold Strength', 'Awarded for completing the Gold Strength Challenge.', 'CompleteChallenge', 'Gold Strength'),
    ('Platinum Strength', 'Awarded for completing the Platinum Strength Challenge.', 'CompleteChallenge', 'Platinum Strength');

    INSERT INTO Achievements
    (title, description, criterion, criterion_detail) VALUES
    ('Bronze Bodyweight', 'Awarded for completing the Bronze Bodyweight Challenge.', 'CompleteChallenge', 'Bronze Bodyweight'),
    ('Silver Bodyweight', 'Awarded for completing the Silver Bodyweight Challenge.', 'CompleteChallenge', 'Silver Bodyweight'),
    ('Gold Bodyweight', 'Awarded for completing the Gold Bodyweight Challenge.', 'CompleteChallenge', 'Gold Bodyweight'),
    ('Platinum Bodyweight', 'Awarded for completing the Platinum Bodyweight Challenge.', 'CompleteChallenge', 'Platinum Bodyweight');

    INSERT INTO Achievements
    (title, description, criterion, criterion_detail) VALUES
    ('Bronze Running', 'Awarded for completing the Bronze Running Challenge.', 'CompleteChallenge', 'Bronze Running'),
    ('Silver Running', 'Awarded for completing the Silver Running Challenge.', 'CompleteChallenge', 'Silver Running'),
    ('Gold Running', 'Awarded for completing the Gold Running Challenge.', 'CompleteChallenge', 'Gold Running'),
    ('Platinum Running', 'Awarded for completing the Platinum Running Challenge.', 'CompleteChallenge', 'Platinum Running');

    INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User'), ('Guest');
    INSERT INTO Exercises (exercise_id, exercise_name , exercise_weight, exercise_reps) VALUES (1, 'Bench Press', 100, 10), (2, 'Squat', 150, 10), (3, 'Deadlift', 200, 10), (4, 'Pull-up', 0, 10), (5, 'Push-up', 0, 10), (6, 'Sit-up', 0, 10), (7, 'Plank', 0, 10);
```

## Toimminnallisuudet

# Profile

 * Pystyt vaihtamaan profiilikluvaasi.
 * Saat motivaatio viestejä.
 * Pystyt lisäämään/seuraamaan omaa edistymistä.
 * voit vertailla uusimpia edistymisiäsi vanhempiin.
 * Näet personal best

 # Foodiary

 * pystyt lisäämään/seuraamaa omaa ruokavaliotasi.
 * voit lisätä lisätietoa ateriastasi

 # Chanllenges

* Pystyt osallistumaan erillaisiin haasteisiin.
* Pystyt filteröimään haasteet(running,strnght ja bodyweight)
* Pääset näkemään mihin haasteisiin olet osallistunut
* Näet prosenteina kuinka suuren osan olet jo tehnyt haasteesta
* Saat saavutuksia kun olet päässy jonkin haasteen loppuun asti.(bronze, silver, gold ja platinium)


# Exercise/workout

* Voit louda itsellesi treenin(gym, cardio tai body weight).
* Workouttiin voit sitten lisätä useamman liikeen(bench press)
* exercise sisältää liikeen, toistojen määrän, sarjojen määrän
* tämän lisäksi excercise voi sisältää painopt, kilometrin määrän. Tämä riippuu excerise tyypistä.
* Näet oman treeni historian
* Voit mennä  haasteisiin
* Pääset suoraan workoutin lisäämiseen navigaattorin sijaitsevasta + napista
* pääset näkemään liikeen tiedot (paino, sarjat, toistot sekä personal best)
* voit poistaa treenin
* liikeen voi poistaa sekä merkata tehdyksi
* kun kaikki liikeet on suoritettu niin treeni merkautuu suoritetuksi


# Home

* Voit mennä  haasteisiin
* Näet kalenterista treenipäiväsi



# Bugit

* foodiaryn poistaminen on hyvin tarkka mistä painaa
* foodiaryn lisäykset palasivat takas kun vaihtoi sivua(korjattu)
* progressin lisäys samaan päivään lisäsi sen olemassa oleviin(korjattu)


# Kuvankaappaukset

<img src="ss/login.png" width="250"/>
<img src="ss/reg.png" width="250"/>
<img src="ss/welcome.png" width="250"/>
<img src="ss/profile.png" width="250"/>
<img src="ss/updateProfilePic.png" width="250"/>
<img src="ss/addprogress.png" width="250"/>
<img src="ss/compare.png" width="250"/>
<img src="ss/workouts.png" width="250"/>
<img src="ss/WorkoutHistory.png" width="250"/>
<img src="ss/newWorkout.png" width="250"/>
<img src="ss/editWorkout.png" width="250"/>
<img src="ss/addExercise.png" width="250"/>
<img src="ss/exercieInfo.png" width="250"/>
<img src="ss/fooddiary.png" width="250"/>
<img src="ss/chanllenge.png" width="250"/>
<img src="ss/challengeDetails.png" width="250"/>
<img src="ss/userChallenge.png" width="250"/>
