{{- define "mongodb.dns" -}}
{{- printf "%s-mongodb.%s.svc.%s" .Release.Name .Release.Namespace "cluster.local" -}}
{{- end -}}
