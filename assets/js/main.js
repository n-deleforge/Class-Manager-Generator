// =================================================
// ============ VARIABLES

const _listInput = get(".gen");
const _message = get("#error");
let tableName; let tableID; let columnsName; let className; let dbType; let dbConnect;

// =================================================
// ============ MAIN

/**
 * Reset all the inputs
 **/

get("#reset").addEventListener("click", () => {
    _message.style.visibility = "hidden";

    // Each empty input increment the error variable
    for (let i = 0; i < _listInput.length; i++) {
        _listInput[i].value = ""; 
    }
});

/**
 * Check the errors in the form and create the files
 **/

get("#generate").addEventListener("click", () => {
    let error = 0;

    // Each empty input increment the error variable
    for (let i = 0; i < _listInput.length; i++) {
        if (_listInput[i].value === "") error++; 
    }

    // Creation of the files
    if (error == 0) {
        _message.style.visibility = "visible";
        _message.innerHTML = _content.downloading;

        // Fulfill variables with correct data
        tableName = get("#tableName").value;
        tableID = get("#tableId").value;
        className = ucFirst(get("#className").value);
        columnsName = get("#columnsName").value.split(',');
        dbType = get("#dbType").value;
        dbConnect = get("#dbConnect").value;

        // Generate data and make it downloadable
        download(generateClass(), className + ".Class.php");
        download(generateManager(), className + "Manager.Class.php");
        if (dbConnect == "true") download(generateDbConnect(), "DbConnect.Class.php");
    }
    else _message.style.visibility = "visible";
});

// =================================================
// ============ CLASS

/**
 * Merge all the functions and generate the class
 **/

function generateClass() {
    return "<?php" + "\n" + 'class ' + className + "\n{\n" + generateAttributes() + "\n" + generateGetterSetter() + "\n" + genererConstruct() + "\n\n}";
}

/**
 * Generate the attributes of the class
 **/

function generateAttributes() {
    let attributes = "";

    for (let i = 0; i < columnsName.length; i++) {
        attributes += "private $_" + columnsName[i] + ";\n";
    }

    return attributes;
}

/**
 * Generate the getter and the setter of the class
 **/

function generateGetterSetter() {
    let getterSetter = "";
    
    for (let i = 0; i < columnsName.length; i++) {
        getterSetter += "public function get" + ucFirst(columnsName[i]) + "()\n" + "{\n" + " return $this->_" + columnsName[i] + ";\n}\n";
        getterSetter += "public function set" + ucFirst(columnsName[i]) + "($_" + columnsName[i] + ")\n" + "{\n" + " return $this->_" + columnsName[i] + " = $_" + columnsName[i] + ";\n}\n";
    }

    return getterSetter;
}

/**
 * Generate the constructor of the class
 **/

function genererConstruct() {
    const construct = "public function __construct(array $options = [])\n{\nif (!empty($options))\n{\n$this->hydrate($options);\n}\n}";
    const hydrate = "public function hydrate($data)\n{\nforeach ($data as $key => $value) {\n$method = \"set\" . ucfirst($key);\nif (is_callable(([$this, $method])))\n{\n$this->$method($value);\n}\n}\n}";

    return construct + "\n" + hydrate;
}

// =================================================
// ============ MANAGER

/**
 * Merge all the functions and generate the manager
 **/

function generateManager() {
    // Remove the ID in the add function
    const key = columnsName.find(el => el == tableID);
    if (key != "undefined") columnsName.splice(columnsName.indexOf(key), 1)

    return "<?php\nclass " + className + "Manager\n{\n" + generateAdd() + "\n\n" + generateUpdate() + "\n\n" + generateDelete() + "\n\n" + generateFindById() + "\n\n" + generateGetList() + "\n\n}";
}

/**
 * Generate the add function of the manager
 **/

function generateAdd() {
    let attributesList = "";
    let sqlValues = "";
    let bindsList = "";

    for (let i = 0; i < columnsName.length; i++) {
        attributesList += columnsName[i] + ",";
        sqlValues += ":" + columnsName[i] + ",";
        bindsList += '$q->bindValue(":' + columnsName[i] + '", $obj->get' + ucFirst(columnsName[i]) + "());\n";
    }

    attributesList = attributesList.substr(0, attributesList.length - 1);
    sqlValues = sqlValues.substr(0, sqlValues.length - 1);

    return "public static function add(" + className + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$q = $db->prepare("INSERT INTO ' + tableName + ' (' + attributesList + ') VALUES (' + sqlValues + ')");\n' + bindsList + "$q->execute();\n}";;
}

/**
 * Generate the update function of the manager
 **/

function generateUpdate() {
    let attributesList = "";
    let bindsList = "";

    for (let i = 0; i < columnsName.length; i++) {
        attributesList += columnsName[i] + "=:" + columnsName[i] + ", ";
        bindsList += '$q->bindValue(":' + columnsName[i] + '", $obj->get' + ucFirst(columnsName[i]) + "());\n";
    }

    bindsList += '$q->bindValue(":' + tableID + '", $obj->get' + ucFirst(tableID) + "());\n";
    attributesList = attributesList.substr(0, attributesList.length - 2);

    return 'public static function update(' + className + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$q = $db->prepare("UPDATE ' + tableName + ' SET ' + attributesList + " WHERE " + tableID + "=:" + tableID + "\");\n" + bindsList + "$q->execute();\n}";
}

/**
 * Generate the delete function of the manager
 **/

function generateDelete() {
    return 'public static function delete(' + className + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$db->exec("DELETE FROM ' + tableName + ' WHERE ' + tableID + '=$obj->get' + ucFirst(tableID) + '()");\n}';
}

/**
 * Generate the findById function of the manager
 **/

function generateFindById() {
    return "public static function findById($id)\n{\n$db = DbConnect::getDb();\n$id = (int) $id;\n" + '$q = $db->query("SELECT * FROM ' + tableName + ' WHERE ' + tableID + '=$id");\n' + "$results = $q->fetch(PDO::FETCH_ASSOC);\nreturn ($results != false) ? new " + className + " ($results) : false;\n}";
}

/**
 * Generate the getList function of the manager
 **/

function generateGetList() {
    return "public static function getList()\n{\n$db = DbConnect::getDb();\n$arr = [];\n" + '$q = $db->query("SELECT * FROM ' + tableName + '");\n' + "while ($donnees = $q->fetch(PDO::FETCH_ASSOC)) if ($donnees != false) $arr[] = new " + className + "($donnees);\nreturn $arr;\n}";
}

// =================================================
// ============ DBCONNECT

/**
 * Generate the dbConnect class
 **/

function generateDbConnect() {
    return "<?php\nclass DbConnect\n{\nprivate static $db;\n\npublic static function getDb()\n{\nreturn DbConnect::$db;\n}\n\npublic static function init()\n{\n$host = '';\n$base = '';\n$user = '';\n$pass = '';\n\ntry {\nself::$db = new PDO('mysql:host=' . $host . '; dbname=' . $base . ';charset=utf8mb4', $user, $pass);\nself::$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n} catch (Exception $e) {\ndie();\n}\n}\n}";
}
