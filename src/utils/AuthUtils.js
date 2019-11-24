// import { Hub } from '@aws-amplify/core';
import { Hub } from '@aws-amplify/core';
import Auth from '@aws-amplify/auth';

export async function getSession() {
    try {
        let a = new Date();
        const session = await Auth.currentSession();
        let b = new Date();
        let difference = (b - a) / 1000;
        return session;
    } catch (e) {
        Hub.dispatch('auth', { event: 'signOut', data: null }, 'Auth');
        return false;
    }
}
