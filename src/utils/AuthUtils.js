// import { Hub } from '@aws-amplify/core';
import { Hub } from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

export async function getSession() {
    try {
        const session = await Auth.currentSession();
        return session;
    } catch (e) {
        Hub.dispatch('auth', { event: 'signOut', data: null }, 'Auth');
        return false;
    }
}
