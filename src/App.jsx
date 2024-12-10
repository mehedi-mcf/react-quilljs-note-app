import { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's styles
import "./App.css";
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaListOl, FaListUl, FaCheckSquare, FaImage } from "react-icons/fa";

const App = () => {
    const [editorContent, setEditorContent] = useState("");
    const [toolbarBottom, setToolbarBottom] = useState(0);

    const quillRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            const viewportHeight = window.visualViewport.height;
            const windowHeight = window.innerHeight;

            if (viewportHeight < windowHeight) {
                // Keyboard is visible
                const keyboardHeight = windowHeight - viewportHeight;
                setToolbarBottom(keyboardHeight + 10); // Position the toolbar above the keyboard
            } else {
                // Keyboard is hidden
                setToolbarBottom(0);
            }
        };

        window.visualViewport.addEventListener("resize", handleResize);

        return () => {
            window.visualViewport.removeEventListener("resize", handleResize);
        };
    }, []);

    // Function to toggle formatting
    const applyFormat = (format, value) => {
        const quill = quillRef.current.getEditor(); // Get the Quill editor instance
        const range = quill.getSelection(); // Get the current selection range

        if (range) {
            // Handle checkbox format separately
            if (format === "check") {
                const currentFormat = quill.getFormat(range.index, range.length);
                if (currentFormat.list === "checked" || currentFormat.list === "unchecked") {
                    quill.format("list", false); // Remove the checkbox
                } else {
                    quill.format("list", "unchecked"); // Add an unchecked checkbox
                }
            } else {
                // Handle other formats
                const currentFormat = quill.getFormat(range.index, range.length);
                if (currentFormat[format]) {
                    quill.format(format, false); // Remove the format
                } else {
                    quill.format(format, value); // Apply the format
                }
            }
        }
    };

    // Function to handle image insertion
    const insertImage = () => {
        const quill = quillRef.current.getEditor(); // Get the Quill editor instance
        const url = prompt("Enter the image URL:");
        if (url) {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", url);

            // After inserting the image, apply CSS styles to resize it
            const editorContainer = quill.root;
            const images = editorContainer.querySelectorAll("img");
            const lastImage = images[images.length - 1]; // Get the most recently added image

            if (lastImage) {
                lastImage.style.width = "100%"; // Set maximum width
                lastImage.style.height = "auto"; // Maintain aspect ratio
                lastImage.style.aspectRatio = "3 / 5"; // Apply 3:5 ratio
            }
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Note Taking App</h1>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editorContent}
                onChange={setEditorContent}
                modules={{ toolbar: false }} // Disable default toolbar
                style={{ marginBottom: "20px", height: "200px" }}
            />
            <div className="toolbar" style={{ bottom: `${toolbarBottom}px` }}>
                <button onClick={() => applyFormat("bold", true)}>
                    <FaBold />
                </button>
                <button onClick={() => applyFormat("italic", true)}>
                    <FaItalic />
                </button>
                <button onClick={() => applyFormat("underline", true)}>
                    <FaUnderline />
                </button>
                <button onClick={() => applyFormat("strike", true)}>
                    <FaStrikethrough />
                </button>
                <button onClick={() => applyFormat("list", "ordered")}>
                    <FaListOl />
                </button>
                <button onClick={() => applyFormat("list", "bullet")}>
                    <FaListUl />
                </button>
                <button onClick={() => applyFormat("check")}>
                    <FaCheckSquare />
                </button>
                <button onClick={insertImage}>
                    <FaImage />
                </button>
            </div>
        </div>
    );
};

export default App;
