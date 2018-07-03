import axios from 'axios'
import dotenv from 'dotenv'

// Silence logs if .env file is missing (configured through environment
// variables instead)
dotenv.load({ silent: true })

export const {
  SENTRY_API_KEY,
  SENTRY_ORGANIZATION,
  SENTRY_PROJECT,
} = process.env

const SENTRY_URL = `https://sentry.io/api/0/projects/${SENTRY_ORGANIZATION}/${SENTRY_PROJECT}` // eslint-disable-line max-len
const axiosClient = axios.create({
  baseURL: SENTRY_URL,
  headers: {
    Authorization: `Bearer ${SENTRY_API_KEY}`
  }
})

export function cleanUpRelease(releaseVersion) {
  return () =>
    axiosClient.delete(`/releases/${releaseVersion}/`)
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(
          `ERROR CLEANING UP RELEASE!
Release version: ${releaseVersion}
Status: ${err.statusCode}
Error: ${err.error}`,
        )
      })
}

export function fetchRelease(version) {
  return axiosClient.get(`/releases/${version}/`)
}

export function fetchFiles(version) {
  return axiosClient.get(`/releases/${version}/files/`)
}
