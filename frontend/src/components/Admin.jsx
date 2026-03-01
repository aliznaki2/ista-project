import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { FILIERES } from '../constants'
import './Formulaire.css'

export default function Admin(){
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [students, setStudents] = useState([])
  const [filters, setFilters] = useState({filiere:'', annee:'', groupe:''})

  const fetchStudents = async () =>{
    const params = {}
    if(filters.filiere) params.filiere = filters.filiere
    if(filters.annee) params.annee = filters.annee
    if(filters.groupe) params.groupe = filters.groupe
    const res = await axios.get('/api/admin/students', { params })
    setStudents(res.data)
  }

  const login = async () =>{
    try{
      await axios.post('/api/admin/login', { password })
      setAuthed(true)
      fetchStudents()
    }catch(err){
      alert('Mot de passe invalide')
    }
  }

  const del = async (id) =>{
    if(!window.confirm('Supprimer cet enregistrement ?')) return
    await axios.delete(`/api/admin/students/${id}`)
    fetchStudents()
  }

  const exportExcel = () =>{
    const params = new URLSearchParams()
    if(filters.filiere) params.append('filiere', filters.filiere)
    if(filters.annee) params.append('annee', filters.annee)
    if(filters.groupe) params.append('groupe', filters.groupe)
    window.open('/api/admin/export?' + params.toString(), '_blank')
  }

  useEffect(()=>{
    if(authed) fetchStudents()
  }, [filters, authed])

  if(!authed) return (
    <div>
      <div className="page-header">
        <img src="/logo.png" alt="ISTA NTIC Logo" className="header-logo"/>
        <h1 className="page-title">ISTA NTIC Sidi Maarouf</h1>
      </div>

      <div className="container">
        <div className="card">
          <div className="welcome-message">
            <p className="text-gray-600">Zone Admin — authentification</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Mot de passe</label>
              <input 
                className="input" 
                type="password" 
                placeholder="Mot de passe admin" 
                value={password} 
                onChange={e=>setPassword(e.target.value)}
                onKeyPress={e=>e.key==='Enter' && login()}
              />
            </div>
            <div>
              <button className="btn" onClick={login}>Entrer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <img src="/logo.png" alt="ISTA NTIC Logo" className="header-logo"/>
        <h1 className="page-title">ISTA NTIC Sidi Maarouf - Admin</h1>
      </div>

      <div className="container admin-container">
        <div className="card">
          <div className="admin-header">
            <h2 className="admin-title">Liste des inscrits</h2>
            <button className="btn btn-export" onClick={exportExcel}>Exporter en Excel</button>
          </div>

          <div className="admin-filters">
            <div>
              <label className="block text-sm font-medium">Filière</label>
              <select 
                className="input" 
                value={filters.filiere} 
                onChange={e=>setFilters({...filters, filiere:e.target.value, annee:'', groupe:''})}
              >
                <option value="">-- Filtrer par filière --</option>
                
                <option value="Gestion">Gestion</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Année</label>
              <select 
                className="input" 
                value={filters.annee} 
                onChange={e=>setFilters({...filters, annee:e.target.value, groupe:''})}
                disabled={!filters.filiere}
              >
                <option value="">-- Filtrer par année --</option>
                {filters.filiere && Object.keys(FILIERES[filters.filiere]).map(a=> <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Groupe</label>
              <select 
                className="input" 
                value={filters.groupe} 
                onChange={e=>setFilters({...filters, groupe:e.target.value})}
                disabled={!filters.annee}
              >
                <option value="">-- Filtrer par groupe --</option>
                {filters.filiere && filters.annee && FILIERES[filters.filiere][filters.annee].map(g=> <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Prénom</th>
                  <th>Nom</th>
                  <th>Filière</th>
                  <th>Année</th>
                  <th>Groupe</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="admin-empty">Aucun étudiant trouvé</td>
                  </tr>
                ) : (
                  students.map(s => (
                    <tr key={s.id}>
                      <td>{s.prenom}</td>
                      <td>{s.nom}</td>
                      <td>{s.filiere}</td>
                      <td>{s.annee}</td>
                      <td>{s.groupe}</td>
                      <td>
                        <button className="btn btn-danger" onClick={()=>del(s.id)}>Supprimer</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
