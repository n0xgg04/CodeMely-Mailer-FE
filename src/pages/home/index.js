import react from 'react'
import { Helmet } from 'react-helmet'
import MailForm from '../../components/pages/home/form.js'
import "./style.scss"

const Home = () => {
    return (
        <>
            <Helmet>
                <title>Gửi mail</title>
                <meta name="description" content="Gửi mail" />
            </Helmet>
            <h1 className="headerNox">Gửi mail </h1>
            <MailForm />
        </>
    )
}

export default Home;