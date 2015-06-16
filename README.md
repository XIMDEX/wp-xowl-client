# Xowl Service client for WordPress

Hemos desarrollado un plugin que trabaja con la última versión de Wordpress (v4.2.2) que se encarga de enriquecer semánticamente el contenido de los posts redactados. 

Se pueden bajar directamente el ZIP e instalarlo como cualquier plugin de WordPress, es decir, descomprimirlo en la carpeta wp-content/plugins y ya el propio WordPress debería reconocerlo como plugin desde su interfaz.

Se instala y habrá que solicitar una API-Key en nuestra página de registro. La URL de dicha página la proporciona el propio módulo para que el usuario se registre fácilmente y sin problemas.
Una vez chequado que el token copiado de nuestra cuenta es correcto, nos vamos a un post con un contenido susceptible de ser enriquecido y veremos que hay un nuevo icono en la barra de herramientas del TinyMCE con forma de etiqueta.

Pulsaremos y veremos como nuestro contenido se enriquece con entidades de diferentes colores según su tipo. Si hay varias menciones para una misma entidad, podremos desambiguar para elegir la que más se adapte a nuestro contexto.

Al guardar y publicar el post, los entidades se traducirán a sus respectivos enlaces a la wikipedia donde podremos encontrar más información de cada una de ellas.
