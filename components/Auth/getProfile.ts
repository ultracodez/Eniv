import { showNotification } from "@mantine/notifications";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useState } from "react";
import {AuthUser, SupabaseClient} from "@supabase/supabase-js"

export async function getProfile(id:any, supabase: SupabaseClient, cCalback:any) {
    try {
      if(!id) {
        return "idnone"
      }
      let { data, error, status } = await supabase
        .from('enivprofiles')
        .select(`username, full_name, avatar_url`).filter('id','eq',id).single();
      if (error && status !== 406) {
        return JSON.stringify(error);
      }

      if (data) {
        cCalback(data);
      }
    } catch (error) {
    } finally {
    }
  }
