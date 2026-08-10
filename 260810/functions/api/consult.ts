/// <reference types="@cloudflare/workers-types" />

interface Env {
  AI: Ai
}

const PROMPT_PREFIX =
  '너는 전문 퍼스널 스타일리스트야. 사진 속 사람과 아래 신체 정보를 참고해서 어울리는 컬러, 핏, 아이템을 한국어로 구체적이고 친절하게 추천해줘. 소제목과 목록을 활용한 보고서 형식으로 작성해.'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const formData = await request.formData()
  const photo = formData.get('photo')
  const height = formData.get('height')
  const weight = formData.get('weight')

  if (!(photo instanceof File) || typeof height !== 'string' || typeof weight !== 'string') {
    return jsonResponse({ error: '사진, 키, 몸무게를 모두 입력해주세요.' }, 400)
  }

  const imageBytes = [...new Uint8Array(await photo.arrayBuffer())]
  const prompt = `${PROMPT_PREFIX}\n\n키: ${height}cm, 몸무게: ${weight}kg`

  const result = await env.AI.run('@cf/llava-hf/llava-1.5-7b-hf', {
    image: imageBytes,
    prompt,
    max_tokens: 1024,
  })

  const report = 'description' in result ? result.description : undefined

  if (!report) {
    return jsonResponse({ error: '보고서를 생성하지 못했습니다.' }, 502)
  }

  return jsonResponse({ report })
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
