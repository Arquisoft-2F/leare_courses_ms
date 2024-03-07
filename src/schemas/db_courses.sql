CREATE TABLE Course (
  course_id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY NOT NULL,
  course_name text NOT NULL,
  course_description text,
  creator_id uuid NOT NULL,
  public bool NOT NULL
  picture_id uuid
  created_at DATE DEFAULT CURRENT_DATE NOT NULL
  updated_at DATE
);

CREATE TABLE Category (
  category_id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY NOT NULL,
  category_name text NOT NULL
);

CREATE TABLE Section (
  section_id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY NOT NULL,
  module_id uuid,
  section_name text NOT NULL,
  section_content text,
  video_id uuid,
  files_array text[], -- Changed array to text[]
  pos_index integer NOT NULL,
  UNIQUE(module_id, pos_index)
);

CREATE TABLE Module (
  module_id uuid DEFAULT gen_random_uuid() UNIQUE PRIMARY KEY NOT NULL,
  module_name text,
  course_id uuid,
  pos_index integer NOT NULL,
  UNIQUE(course_id, pos_index)
);

CREATE TABLE Course_Category (
  course_id uuid,
  category_id uuid
);

ALTER TABLE Course_Category ADD FOREIGN KEY (course_id) REFERENCES Course (course_id);

ALTER TABLE Course_Category ADD FOREIGN KEY (category_id) REFERENCES Category (category_id);

ALTER TABLE Module ADD FOREIGN KEY (course_id) REFERENCES Course (course_id);

ALTER TABLE Section ADD FOREIGN KEY (module_id) REFERENCES Module (module_id);

ALTER TABLE Section 
ADD CONSTRAINT fk_module_section FOREIGN KEY (module_id) 
REFERENCES Module(module_id) 
ON DELETE CASCADE;
