import {
    React,
    useState,
    useEffect
} from 'react';

import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { Redirect } from 'react-router-dom';

function FormulaireModifierPiece({ id }) {
    const [titre, setTitre] = useState('');
    const [artiste, setArtiste] = useState('');
    const [categories, setCategories] = useState('');
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
            method: 'post',
            body: JSON.stringify({ titre, artiste, categorie: categories }),
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
    if (!categories?.length) {
        return (<div></div>);
    }
    else {
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
                    <Form.Group>
                        <Form.Label>Catégories</Form.Label>
                        {
                            categories.map((categorie) =>
                                <>
                                <Form.Control className="my-2" type="text" value={categorie}
                                    onChange={(event) => setCategories(event.target.value)} />
                                </>
                            )}
                    </Form.Group>

                    <Button variant="success" onClick={envoyerFormulaire} >
                        Modifier
            </Button>
                </Form>
            </>
        );
    }
}

export default FormulaireModifierPiece;