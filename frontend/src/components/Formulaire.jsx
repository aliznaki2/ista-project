import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FILIERES } from '../constants'
import './Formulaire.css'

export default function Formulaire() {
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [cin, setCin] = useState('')
  const [filiere, setFiliere] = useState('')
  const [annee, setAnnee] = useState('')
  const [groupe, setGroupe] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [existingCins, setExistingCins] = useState([]) // liste CIN existants
  const [cinError, setCinError] = useState(false)

  // récupérer la liste des CIN existants au chargement du composant
  useEffect(() => {
    const fetchCins = async () => {
      try {
        const res = await axios.get('/api/cins') // API doit retourner un tableau de CIN
        setExistingCins(res.data)
      } catch (err) {
        console.error('Impossible de récupérer la liste des CIN')
      }
    }
    fetchCins()
  }, [])

  // vérifier le CIN à chaque modification
  useEffect(() => {
    if (cin && existingCins.includes(cin.trim())) {
      setCinError(true)
    } else {
      setCinError(false)
    }
  }, [cin, existingCins])

  const annees = filiere && FILIERES[filiere] ? Object.keys(FILIERES[filiere]) : []
  const groupes = filiere && annee && FILIERES[filiere] ? FILIERES[filiere][annee] || [] : []

  const submit = async (e) => {
    e.preventDefault()
    if (cinError) return 
    setMsg('')
    setLoading(true)
    try {
      const res = await axios.post('/api/apply', { prenom, nom, cin, filiere, annee, groupe })
      setMsg(res.data.message || 'Inscription enregistrée')
      setPrenom('')
      setNom('')
      setCin('')
      setFiliere('')
      setAnnee('')
      setGroupe('')
      
      setExistingCins(prev => [...prev, cin])
    } catch (err) {
      setMsg(err.response?.data?.error || 'Erreur serveur')
    } finally {
      setLoading(false)
      setTimeout(() => setMsg(''), 5000)
    }
  }

  return (
    <div>
     <div className="poster-header">
  <img src="/logo.png" alt="ISTA NTIC Logo" className="poster-logo" />

  <div className="poster-titles">
    <h2 className="poster-top">CF AIN CHOCK</h2>
    <h2 className="poster-top">ISTA NTIC SIDI MAAROUF</h2>

    <h1 className="poster-main">Workshop SAP</h1>

    <h3 className="poster-sub">
      ERP & Transformation Digitale des Entreprises
    </h3>

    <p className="poster-speaker">Avec Tariq EL BAHLOUL</p>

    <div className="poster-info">
      <span>📅 Le 27/03/2026</span>
      <span>⏰ De 9h à 11h</span>
    </div>
  </div>
</div>


      <div className="container">
        <div className="card">
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label htmlFor="prenom" className="block text-sm font-medium">👤 Prénom *</label>
              <input
                id="prenom"
                className="input"
                value={prenom}
                onChange={e => setPrenom(e.target.value)}
                placeholder="Entrez votre prénom"
                required
              />
            </div>

            <div>
              <label htmlFor="nom" className="block text-sm font-medium">👤 Nom *</label>
              <input
                id="nom"
                className="input"
                value={nom}
                onChange={e => setNom(e.target.value)}
                placeholder="Entrez votre nom"
                required
              />
            </div>

            <div>
              <label htmlFor="cin" className="block text-sm font-medium">🆔 CIN *</label>
              <input
                id="cin"
                className={`input ${cinError ? 'border-red-500' : ''}`}
                value={cin}
                onChange={e => setCin(e.target.value)}
                placeholder="Entrez votre CIN"
                required
              />
              {cinError && <p className="text-red-600 text-sm mt-1">Ce CIN est déjà utilisé.</p>}
            </div>

            <div>
              <label htmlFor="filiere" className="block text-sm font-medium">🎓 Filière *</label>
              <select
                id="filiere"
                className="input"
                value={filiere}
                onChange={e => { setFiliere(e.target.value); setAnnee(''); setGroupe('') }}
                required
              >
                <option value="">-- Choisir la filière --</option>
                {Object.keys(FILIERES).map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="annee" className="block text-sm font-medium">📅 Année d'études *</label>
              <select
                id="annee"
                className="input"
                value={annee}
                onChange={e => { setAnnee(e.target.value); setGroupe('') }}
                disabled={!filiere}
                required
              >
                <option value="">-- Choisir l'année --</option>
                {annees.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="groupe" className="block text-sm font-medium">👥 Groupe *</label>
              <select
                id="groupe"
                className="input"
                value={groupe}
                onChange={e => setGroupe(e.target.value)}
                disabled={!annee}
                required
              >
                <option value="">-- Choisir le groupe --</option>
                {groupes.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div>
              <button className="btn" type="submit" disabled={loading || cinError}>
                {loading ? 'Enregistrement...' : "S'inscrire"}
              </button>
            </div>

            {msg && (
              <p className={`text-sm ${msg.toLowerCase().includes('erreur') ? 'text-red-600' : 'text-green-600'}`}>
                {msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
