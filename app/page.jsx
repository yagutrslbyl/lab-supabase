'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './page.module.css'

export default function Home() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('') 
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name', { ascending: true }) 

      if (error) {
        setError(error.message)
      } else {
        setStudents(data)
      }
      setLoading(false)
    }

    fetchStudents()
  }, [])

  // Tələbələri adına görə filter edirik
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Student List</h1>
        <p>Data coming live from your Supabase backend</p>
      </header>

      <main className={styles.main}>
        {/* Axtarış Inputu */}
        {!loading && !error && (
          <div style={{ marginBottom: '20px', width: '100%' }}>
            <input
              type="text"
              placeholder="🔍 Search student by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '16px'
              }}
            />
          </div>
        )}

        {loading && (
          <p className={styles.message}>Loading students...</p>
        )}

        {error && (
          <div className={styles.errorBox}>
            <p className={styles.errorTitle}>Could not connect to Supabase</p>
            <code className={styles.errorDetail}>{error}</code>
          </div>
        )}

        {!loading && !error && filteredStudents.length === 0 && (
          <p className={styles.message}>No students found matching your search.</p>
        )}

        {!loading && !error && filteredStudents.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className={styles.avatarCell}>
                    <img
                      className={styles.avatar}
                      src={student.picture_url}
                      alt={student.name}
                    />
                  </td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}