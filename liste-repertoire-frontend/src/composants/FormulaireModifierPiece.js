import {
    React,
    useState,
    useEffect
} from 'react';

import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { Redirect } from 'react-router-dom';

function FormulaireModifierPiece({ id }) {
    const [titre, setTitre] = useState('');
    const [artiste, setArtiste] = useState('');
    const [categories, setCategories] = useState([]);
    const [rediriger, setRediriger] = useState(false);

    useEffect(() => {
        const chercherDonnees = async () => {
            const resultat = await fetch(`/api/pieces/${id}`);
            const body = await resultat.json().catch((error) => { console.log(error) });
            setTitre(body.titre);
            setArtiste(body.artiste);
            setCategories(body.categorie);
        };
        chercherDonnees();
    }, [id]);

    const envoyerFormulaire = async () => {
        await fetch(`/api/pieces/modifier/${id}`, {
            method: 'put',
            body: JSON.stringify({ titre, artiste, categories: categories }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        setRediriger(true);
    };

    function AfficherRedirection() {
        if (rediriger === true) {
            return <Redirect to="/admin" />
        }
    }


    function AjouterCategorie() {
        var nouvelleCategorie = categories.slice();
        nouvelleCategorie.push('');
        setCategories(nouvelleCategorie);
    }


    function ChangementCategorie(index, valeur) {
        var categorieChangee = categories.slice();
        categorieChangee.splice(index, 1, valeur)
        setCategories(categorieChangee);
    }

    function SupprimerCategorie(index) {
        var categorieSupprimee = categories.slice();
        categorieSupprimee.splice(index, 1);
        setCategories(categorieSupprimee);
    }
    return (
        <>
            {AfficherRedirection()}
            <Form className="mb-1">
                <Form.Group>
                    <Form.Label>Titre</Form.Label>
                    <Form.Control type="text" value={titre}
                        onChange={(event) => setTitre(event.target.value)} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Artiste / Groupe</Form.Label>
                    <Form.Control type="text" value={artiste}
                        onChange={(event) => setArtiste(event.target.value)} />
                </Form.Group>
                <Form.Group >
                    <Form.Label>Catégories</Form.Label>
                    {
                        categories.map((categorie, index) =>
                            <InputGroup>
                                <Form.Control className="my-2" type="text" value={categorie}
                                    onChange={(event) => ChangementCategorie(index, event.target.value)} />

                                <InputGroup.Append>
                                    <Button className="my-2" variant="danger" onClick={() => SupprimerCategorie(index)} >
                                        X
                                            </Button>
                                </InputGroup.Append>
                            </InputGroup>
                        )}
                    <div className="text-center">
                        <Button className="ml-2" variant="success" onClick={AjouterCategorie} >
                            +
                        </Button>
                    </div>
                </Form.Group>
                <Button variant="success" onClick={envoyerFormulaire} >
                    Appliquer les modifications
                </Button>
            </Form>
        </>
    );
}

export default FormulaireModifierPiece;