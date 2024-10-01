document.addEventListener('DOMContentLoaded', () => {
    const gradeForm = document.getElementById('gradeForm');
    const generateFieldsButton = document.getElementById('generateFields');
    const notesInputsDiv = document.getElementById('notesInputs');
    const resultDiv = document.getElementById('result');

    // Datos de las asignaturas en formato JSON
    const subjectsData = [
        { "name": "Matemáticas", "professor": "Profesor A" },
        { "name": "Historia", "professor": "Profesor B" },
        { "name": "Ciencias", "professor": "Profesor C" },
        { "name": "Lengua", "professor": "Profesor D" },
        { "name": "Geografía", "professor": "Profesor E" },
        { "name": "Física", "professor": "Profesor F" },
        { "name": "Química", "professor": "Profesor G" },
        { "name": "Biología", "professor": "Profesor H" },
        { "name": "Informática", "professor": "Profesor I" },
        { "name": "Educación Física", "professor": "Profesor J" },
    ];

    let animacionActiva = false;

    document.getElementById('btn-interact').addEventListener('click', function() {
        const splineEmbed = document.getElementById('spline-embed');
        if (!animacionActiva) {
            splineEmbed.style.animation = 'animacion 2s infinite';
            animacionActiva = true;
        } else {
            splineEmbed.style.animation = '';
            animacionActiva = false;
        }
    });

    // Event listener para generar campos de notas
    generateFieldsButton.addEventListener('click', () => {
        notesInputsDiv.innerHTML = ''; // Limpiar cualquier campo existente
        const subjectCount = parseInt(document.getElementById('subjectCount').value, 10);

        if (isNaN(subjectCount) || subjectCount < 1) {
            alert('Por favor, ingrese un número válido de asignaturas.');
            return;
        }

        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= subjectCount; i++) {
            const subjectLabel = document.createElement('label');
            subjectLabel.setAttribute('for', `note${i}`);
            subjectLabel.textContent = `Nota de la Asignatura ${i} (${subjectsData[i - 1].name} - ${subjectsData[i - 1].professor}):`;

            const noteInput = document.createElement('input');
            noteInput.setAttribute('type', 'number');
            noteInput.setAttribute('id', `note${i}`);
            noteInput.setAttribute('name', `note${i}`);
            noteInput.setAttribute('min', '0');
            noteInput.setAttribute('max', '10');
            noteInput.setAttribute('required', 'required');

            // Agregar elementos al fragmento
            fragment.appendChild(subjectLabel);
            fragment.appendChild(noteInput);
        }

        notesInputsDiv.appendChild(fragment);
    });

    // Event listener para el formulario
    gradeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const subjectCount = parseInt(document.getElementById('subjectCount').value, 10);
        let notes = [];

        for (let i = 1; i <= subjectCount; i++) {
            const note = parseFloat(document.getElementById(`note${i}`).value);
            if (isNaN(note)) {
                alert(`Por favor, ingrese una nota válida para la Asignatura ${i}.`);
                return;
            }
            notes.push(note);
        }

        // Calcular el promedio
        const sum = notes.reduce((acc, curr) => acc + curr, 0);
        const average = sum / subjectCount;

        // Almacenar los datos en localStorage
        const data = {
            subjectCount: subjectCount,
            notes: notes,
            average: average
        };
        localStorage.setItem('gradeData', JSON.stringify(data));

        // Mostrar el resultado en el DOM
        resultDiv.innerHTML = `
            <p>Promedio de las notas: ${average.toFixed(2)}</p>
            <p>Detalles de las notas ingresadas:</p>
            <ul>
                ${notes.map((note, index) => `<li>Asignatura ${index + 1}: ${note}</li>`).join('')}
            </ul>
        `;
    });

    // Recuperar datos del localStorage al cargar la página
    const storedData = JSON.parse(localStorage.getItem('gradeData'));

    if (storedData) {
        document.getElementById('subjectCount').value = storedData.subjectCount;
        generateFieldsButton.click(); // Generar campos de notas

        storedData.notes.forEach((note, index) => {
            document.getElementById(`note${index + 1}`).value = note;
        });

        resultDiv.innerHTML = `
            <p>Promedio de las notas: ${storedData.average.toFixed(2)}</p>
            <p>Detalles de las notas ingresadas:</p>
            <ul>
                ${storedData.notes.map((note, index) => `<li>Asignatura ${index + 1}: ${note}</li>`).join('')}
            </ul>
        `;
    }
});